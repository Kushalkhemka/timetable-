#!/usr/bin/env python3
"""
DTU Scheduler with Flexible Teacher Assignments
- Lectures: One teacher for the whole week
- Tutorials: Can have different teacher
- Labs/Practicals: Can have different teacher
"""

import xml.etree.ElementTree as ET
import sys
import argparse
import random
import csv
import json
import numpy as np
from datetime import datetime
from collections import defaultdict

class DTUFlexibleTeacherScheduler:
    def __init__(self, xml_file, generations=500, population_size=100):
        """Initialize the scheduler with flexible teacher assignments"""
        self.xml_file = xml_file
        
        # DTU-specific settings
        self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        self.periods_per_day = 10
        self.periods = [f'P{i}' for i in range(1, self.periods_per_day + 1)]
        self.flexible_lunch_periods = [4, 5, 6]  # P5, P6, P7
        self.preferred_class_periods = [2, 3, 4, 5, 6, 7, 8]  # P3 to P9
        
        # Reserve Tuesday/Thursday first two periods for AEC/VAC
        self.reserved_slots = set()
        
        # Data structures
        self.students = {}
        self.rooms = {}
        self.instructors = {}
        self.courses = {}
        self.classes = {}
        self.time_slots = {}
        
        # Flexible teacher assignments
        self.teacher_assignments = {}  # {class_id: instructor_id}
        # Track lab pairs per course-student group
        self.lab_pairs_by_group = defaultdict(list)  # {f"{course}_{students}": [class_ids...]}
        
        self.parse_xml()
        self.setup_time_structure()
        self.assign_teachers_flexibly()
        
        # GA parameters (optimized for speed)
        self.population_size = population_size
        self.generations = generations
        self.mutation_rate = 0.2
        self.crossover_rate = 0.8
        self.tournament_size = 5
        self.elite_size = 5
        self.stagnation_limit = 50
        
    def setup_time_structure(self):
        """Setup 10-period day structure (5 days only)"""
        self.time_slots = {}
        slot_id = 0
        for day in range(5):
            for period in range(self.periods_per_day):
                self.time_slots[slot_id] = {
                    'day': day,
                    'period': period,
                    'day_name': self.days[day],
                    'period_name': self.periods[period]
                }
                slot_id += 1
        
        # Reserve Tuesday/Thursday first two periods for AEC/VAC
        self.reserved_slots = set()
        for d in [1, 3]:  # Tuesday and Thursday
            for p in [0, 1]:  # First two periods
                self.reserved_slots.add(d * self.periods_per_day + p)
    
    def parse_xml(self):
        """Parse the XML file structure"""
        tree = ET.parse(self.xml_file)
        root = tree.getroot()
        
        # Parse basic configuration
        self.nr_days = int(root.get('nrDays', 5))
        self.nr_weeks = int(root.get('nrWeeks', 16))
        self.slots_per_day = int(root.get('slotsPerDay', 10))
        
        # Parse rooms
        for room in root.findall('rooms/room'):
            room_id = room.get('id')
            self.rooms[room_id] = {
                'capacity': int(room.get('capacity', 100)),
                'type': room.get('type', 'regular'),
                'course': room.get('course', ''),
                'name': room.get('name', room_id)
            }
        
        # Parse instructors
        for instructor in root.findall('instructors/instructor'):
            inst_id = instructor.get('id')
            self.instructors[inst_id] = {
                'name': instructor.get('name', ''),
                'department': instructor.get('department', ''),
                'designation': instructor.get('designation', ''),
                'specialization': instructor.get('specialization', ''),
                'email': instructor.get('email', '')
            }
        
        # Parse courses
        for course in root.findall('courses/course'):
            course_id = course.get('id')
            parts = []
            for part in course.findall('parts/part'):
                parts.append({
                    'id': part.get('id'),
                    'name': part.get('name')
                })
            self.courses[course_id] = {
                'name': course.get('name', ''),
                'parts': parts
            }
        
        # Parse students
        for student in root.findall('students/student'):
            student_id = student.get('id')
            courses = []
            for course in student.findall('course'):
                courses.append(course.get('course'))
            self.students[student_id] = {
                'name': student.get('name', ''),
                'courses': courses
            }
        
        # Parse classes
        for class_elem in root.findall('classes/class'):
            class_id = class_elem.get('id')
            course_id = class_elem.get('course')
            part = class_elem.get('part')
            students = class_elem.get('students')
            weeks = class_elem.get('weeks', '1111111111111111')
            room = class_elem.get('room', '')
            
            self.classes[class_id] = {
                'course': course_id,
                'part': part,
                'students': students,
                'weeks': weeks,
                'room': room
            }

            # Build lab pairing buckets (two practicals per week expected)
            if part == 'P':
                key = f"{course_id}_{students}"
                self.lab_pairs_by_group[key].append(class_id)
    
    def assign_teachers_flexibly(self):
        """Assign teachers flexibly: different teachers for L, T, P parts"""
        # Group classes by course, student group, and part type
        course_student_part_groups = defaultdict(list)
        
        for class_id, class_info in self.classes.items():
            course_id = class_info['course']
            students = class_info['students']
            part = class_info['part']
            key = f"{course_id}_{students}_{part}"
            course_student_part_groups[key].append(class_id)
        
        # Assign teachers to each group
        for group_key, class_ids in course_student_part_groups.items():
            course_id = group_key.split('_')[0]
            part = group_key.split('_')[2]
            
            # Find instructors with matching specialization
            available_instructors = [
                inst_id for inst_id, inst_info in self.instructors.items()
                if inst_info['specialization'] == course_id
            ]
            
            if available_instructors:
                # Select instructor for this part type
                selected_instructor = random.choice(available_instructors)
            else:
                # Fallback: assign any instructor
                selected_instructor = random.choice(list(self.instructors.keys()))
            
            # Assign this instructor to all classes in this group
            for class_id in class_ids:
                self.teacher_assignments[class_id] = selected_instructor
    
    def generate_individual(self):
        """Generate a random individual (timetable)"""
        individual = {}
        
        for class_id in self.classes.keys():
            # Skip reserved slots
            available_slots = [slot for slot in self.time_slots.keys() 
                             if slot not in self.reserved_slots]
            
            if available_slots:
                individual[class_id] = random.choice(available_slots)
            else:
                individual[class_id] = 0
        
        return individual
    
    def calculate_fitness(self, individual):
        """Calculate fitness with optimized constraints"""
        fitness = 0
        
        # Hard constraints (high penalty)
        fitness += self.check_room_availability(individual) * 1000
        fitness += self.check_faculty_clash(individual) * 1000
        fitness += self.check_student_clash(individual) * 1000
        fitness += self.check_working_hours(individual) * 1000
        fitness += self.check_lab_room_requirements(individual) * 1000
        fitness += self.check_lab_pairing(individual) * 1000
        
        # Soft constraints (lower penalty)
        fitness += self.check_balanced_daily_workload(individual) * 10
        fitness += self.check_class_distribution(individual) * 5
        fitness += self.check_preferred_time_slots(individual) * 2
        
        return fitness
    
    def check_room_availability(self, individual):
        """Check if rooms are not double-booked"""
        conflicts = 0
        room_schedule = defaultdict(set)
        
        for class_id, time_slot in individual.items():
            class_info = self.classes[class_id]
            room_id = class_info.get('room', '')
            
            if room_id and room_id in self.rooms:
                if time_slot in room_schedule[room_id]:
                    conflicts += 1
                room_schedule[room_id].add(time_slot)
        
        return conflicts
    
    def check_faculty_clash(self, individual):
        """Check if faculty are not double-booked"""
        conflicts = 0
        faculty_schedule = defaultdict(set)
        
        for class_id, time_slot in individual.items():
            instructor_id = self.teacher_assignments.get(class_id)
            if instructor_id:
                if time_slot in faculty_schedule[instructor_id]:
                    conflicts += 1
                faculty_schedule[instructor_id].add(time_slot)
        
        return conflicts
    
    def check_student_clash(self, individual):
        """Check if students are not double-booked"""
        conflicts = 0
        student_schedule = defaultdict(set)
        
        for class_id, time_slot in individual.items():
            class_info = self.classes[class_id]
            students = class_info['students']
            
            if time_slot in student_schedule[students]:
                conflicts += 1
            student_schedule[students].add(time_slot)
        
        return conflicts
    
    def check_working_hours(self, individual):
        """Check if classes are within working hours"""
        violations = 0
        
        for class_id, time_slot in individual.items():
            if time_slot not in self.time_slots:
                violations += 1
            elif time_slot in self.reserved_slots:
                violations += 1
        
        return violations
    
    def check_lab_room_requirements(self, individual):
        """Check if practical classes are in lab rooms"""
        violations = 0
        
        for class_id, time_slot in individual.items():
            class_info = self.classes[class_id]
            if class_info['part'] == 'P':  # Practical class
                room_id = class_info.get('room', '')
                if room_id and room_id in self.rooms:
                    if self.rooms[room_id]['type'] != 'lab':
                        violations += 1
        
        return violations
    
    def check_balanced_daily_workload(self, individual):
        """Check for balanced daily workload"""
        penalty = 0
        daily_load = defaultdict(int)
        
        for class_id, time_slot in individual.items():
            if time_slot in self.time_slots:
                day = self.time_slots[time_slot]['day']
                daily_load[day] += 1
        
        # Penalize extreme loads
        for day, load in daily_load.items():
            if load > 8:  # Too many classes
                penalty += load - 8
            elif load < 1:  # Too few classes
                penalty += 1 - load
        
        return penalty
    
    def check_class_distribution(self, individual):
        """Check for good class distribution"""
        penalty = 0
        
        # Group by course and student
        course_student_schedule = defaultdict(list)
        for class_id, time_slot in individual.items():
            class_info = self.classes[class_id]
            course_id = class_info['course']
            students = class_info['students']
            key = f"{course_id}_{students}"
            course_student_schedule[key].append(time_slot)
        
        # Check for clustering
        for key, slots in course_student_schedule.items():
            if len(slots) > 1:
                slots.sort()
                for i in range(len(slots) - 1):
                    if slots[i+1] - slots[i] < 2:  # Too close
                        penalty += 1
        
        return penalty
    
    def check_preferred_time_slots(self, individual):
        """Check if classes are in preferred time slots"""
        penalty = 0
        
        for class_id, time_slot in individual.items():
            if time_slot in self.time_slots:
                period = self.time_slots[time_slot]['period']
                if period not in self.preferred_class_periods:
                    penalty += 1
        
        return penalty
    
    def crossover(self, parent1, parent2):
        """Perform crossover between two parents"""
        if random.random() > self.crossover_rate:
            return parent1.copy(), parent2.copy()
        
        child1 = parent1.copy()
        child2 = parent2.copy()
        
        # Single-point crossover
        crossover_point = random.randint(1, len(self.classes) - 1)
        class_ids = list(self.classes.keys())
        
        for i in range(crossover_point, len(class_ids)):
            class_id = class_ids[i]
            child1[class_id] = parent2[class_id]
            child2[class_id] = parent1[class_id]
        
        return child1, child2
    
    def mutate(self, individual):
        """Mutate an individual"""
        if random.random() > self.mutation_rate:
            return individual
        
        mutated = individual.copy()
        class_id = random.choice(list(self.classes.keys()))
        
        # Choose a new time slot
        available_slots = [slot for slot in self.time_slots.keys() if slot not in self.reserved_slots]
        
        # If this is part of a lab pair, try to place both consecutively on same day
        class_info = self.classes[class_id]
        if class_info['part'] == 'P':
            key = f"{class_info['course']}_{class_info['students']}"
            pair = self.lab_pairs_by_group.get(key, [])
            if len(pair) == 2 and random.random() < 0.7:
                # Choose random day and start period for two consecutive slots
                day = random.randint(0, 4)
                start_period = random.randint(0, self.periods_per_day - 2)
                slot1 = day * self.periods_per_day + start_period
                slot2 = day * self.periods_per_day + start_period + 1
                if slot1 not in self.reserved_slots and slot2 not in self.reserved_slots:
                    mutated[pair[0]] = slot1
                    mutated[pair[1]] = slot2
                    return mutated
        
        if available_slots:
            mutated[class_id] = random.choice(available_slots)
        
        return mutated
    
    def tournament_selection(self, population, fitness_scores):
        """Tournament selection"""
        tournament = random.sample(list(zip(population, fitness_scores)), self.tournament_size)
        tournament.sort(key=lambda x: x[1])
        return tournament[0][0]
    
    def run_genetic_algorithm(self):
        """Run the genetic algorithm"""
        print("Starting Flexible Teacher Genetic Algorithm...")
        print(f"Population size: {self.population_size}")
        print(f"Generations: {self.generations}")
        print(f"Classes to schedule: {len(self.classes)}")
        print(f"Time slots available: {len(self.time_slots)}")
        print(f"Reserved slots (AEC/VAC): {len(self.reserved_slots)}")
        print()
        
        # Initialize population
        population = [self.generate_individual() for _ in range(self.population_size)]
        # Repair initial population for lab pairing
        population = [self.repair_lab_pairs(ind) for ind in population]
        best_fitness = float('inf')
        stagnation_count = 0
        best_individual = None
        
        for generation in range(self.generations):
            # Calculate fitness
            fitness_scores = [self.calculate_fitness(ind) for ind in population]
            
            # Track best individual
            min_fitness = min(fitness_scores)
            if min_fitness < best_fitness:
                best_fitness = min_fitness
                best_individual = population[fitness_scores.index(min_fitness)]
                stagnation_count = 0
            else:
                stagnation_count += 1
            
            # Print progress
            if generation % 50 == 0:
                print(f"Generation {generation}: Best fitness = {best_fitness}")
            
            # Check for stagnation
            if stagnation_count >= self.stagnation_limit:
                print(f"Stagnation detected at generation {generation}")
                break
            
            # Create new population
            new_population = []
            
            # Elitism
            elite_indices = sorted(range(len(fitness_scores)), key=lambda i: fitness_scores[i])[:self.elite_size]
            for idx in elite_indices:
                new_population.append(population[idx])
            
            # Generate rest of population
            while len(new_population) < self.population_size:
                parent1 = self.tournament_selection(population, fitness_scores)
                parent2 = self.tournament_selection(population, fitness_scores)
                
                child1, child2 = self.crossover(parent1, parent2)
                child1 = self.mutate(child1)
                child2 = self.mutate(child2)
                # Repair offspring for lab pairing
                child1 = self.repair_lab_pairs(child1)
                child2 = self.repair_lab_pairs(child2)
                
                new_population.extend([child1, child2])
            
            population = new_population[:self.population_size]
        
        print(f"\nFinal best fitness: {best_fitness}")
        return best_individual, best_fitness

    def check_lab_pairing(self, individual):
        """Ensure each course-student lab pair occupies two consecutive slots on same day and same room"""
        violations = 0
        for key, class_ids in self.lab_pairs_by_group.items():
            if len(class_ids) != 2:
                continue
            c1, c2 = class_ids[0], class_ids[1]
            if c1 not in individual or c2 not in individual:
                violations += 1
                continue
            s1 = individual[c1]
            s2 = individual[c2]
            if s1 not in self.time_slots or s2 not in self.time_slots:
                violations += 1
                continue
            d1 = self.time_slots[s1]['day']
            p1 = self.time_slots[s1]['period']
            d2 = self.time_slots[s2]['day']
            p2 = self.time_slots[s2]['period']
            # Same day and consecutive periods (order can be either)
            if not (d1 == d2 and abs(p1 - p2) == 1):
                violations += 1
                continue
            # Same room requirement
            r1 = self.classes[c1].get('room', '')
            r2 = self.classes[c2].get('room', '')
            if r1 and r2 and r1 != r2:
                violations += 1
        return violations

    def repair_lab_pairs(self, individual):
        """Force each lab pair to be two consecutive periods on the same day (skip reserved)."""
        repaired = dict(individual)
        for key, class_ids in self.lab_pairs_by_group.items():
            if len(class_ids) != 2:
                continue
            c1, c2 = class_ids
            s1 = repaired.get(c1)
            s2 = repaired.get(c2)
            ok = False
            if s1 in self.time_slots and s2 in self.time_slots:
                d1 = self.time_slots[s1]['day']
                p1 = self.time_slots[s1]['period']
                d2 = self.time_slots[s2]['day']
                p2 = self.time_slots[s2]['period']
                ok = (d1 == d2 and abs(p1 - p2) == 1)
            if ok:
                continue
            # Choose a random day and consecutive slot avoiding reserved
            attempts = 20
            assigned = False
            for _ in range(attempts):
                day = random.randint(0, 4)
                start_period = random.randint(0, self.periods_per_day - 2)
                slot1 = day * self.periods_per_day + start_period
                slot2 = day * self.periods_per_day + start_period + 1
                if slot1 in self.reserved_slots or slot2 in self.reserved_slots:
                    continue
                repaired[c1] = slot1
                repaired[c2] = slot2
                assigned = True
                break
            if not assigned:
                # Fallback to first available non-reserved consecutive pair (day-major)
                for day in range(5):
                    for start_period in range(self.periods_per_day - 1):
                        slot1 = day * self.periods_per_day + start_period
                        slot2 = slot1 + 1
                        if slot1 in self.reserved_slots or slot2 in self.reserved_slots:
                            continue
                        repaired[c1] = slot1
                        repaired[c2] = slot2
                        assigned = True
                        break
                    if assigned:
                        break
        return repaired

    def validation_summary(self, individual):
        """Compute and return a dict with validation counts for key constraints"""
        return {
            'room_conflicts': self.check_room_availability(individual),
            'student_conflicts': self.check_student_clash(individual),
            'faculty_conflicts': self.check_faculty_clash(individual),
            'outside_working_hours': self.check_working_hours(individual),
            'lab_in_non_lab_room': self.check_lab_room_requirements(individual),
            'lab_pairing_violations': self.check_lab_pairing(individual),
        }

    def print_and_save_validation(self, individual, base_filename):
        """Print validation summary and save to JSON"""
        summary = self.validation_summary(individual)
        print("\nValidation Summary (post-optimization):")
        for k, v in summary.items():
            print(f"- {k}: {v}")
        with open(f"{base_filename}_validation.json", 'w') as f:
            json.dump(summary, f, indent=2)
        return summary

    def repair_room_conflicts(self, individual):
        """Resolve any room double-bookings by moving conflicting classes to free slots.
        For practicals, move the whole pair to another consecutive slot in same room.
        """
        repaired = dict(individual)
        # Build room occupancy map
        room_to_slots = defaultdict(set)
        slot_to_room_classes = defaultdict(lambda: defaultdict(list))
        for class_id, slot in repaired.items():
            room_id = self.classes[class_id].get('room', '')
            if room_id:
                slot_to_room_classes[slot][room_id].append(class_id)
                room_to_slots[room_id].add(slot)

        # Resolve conflicts per slot and room
        for slot, room_map in slot_to_room_classes.items():
            for room_id, clist in room_map.items():
                if len(clist) <= 1:
                    continue
                # Keep first, move others
                for class_id in clist[1:]:
                    class_info = self.classes[class_id]
                    part = class_info['part']
                    moved = False
                    if part == 'P':
                        # Move the full pair for this course+students
                        key = f"{class_info['course']}_{class_info['students']}"
                        pair = self.lab_pairs_by_group.get(key, [])
                        if len(pair) == 2:
                            c1, c2 = pair
                            # Determine which one is this and ensure both moved together
                            # Find consecutive free slots in same room avoiding reserved and existing occupancy
                            for day in range(5):
                                for start in range(self.periods_per_day - 1):
                                    s1 = day * self.periods_per_day + start
                                    s2 = s1 + 1
                                    if s1 in self.reserved_slots or s2 in self.reserved_slots:
                                        continue
                                    if s1 not in room_to_slots[room_id] and s2 not in room_to_slots[room_id]:
                                        repaired[c1] = s1
                                        repaired[c2] = s2
                                        room_to_slots[room_id].add(s1)
                                        room_to_slots[room_id].add(s2)
                                        moved = True
                                        break
                                if moved:
                                    break
                    else:
                        # Single-slot move within same room
                        for day in range(5):
                            for period in range(self.periods_per_day):
                                s = day * self.periods_per_day + period
                                if s in self.reserved_slots:
                                    continue
                                if s not in room_to_slots[room_id]:
                                    repaired[class_id] = s
                                    room_to_slots[room_id].add(s)
                                    moved = True
                                    break
                            if moved:
                                break
        return repaired

    def repair_student_conflicts(self, individual):
        """Resolve student double bookings by moving conflicting classes.
        - If practical, move the lab pair to new consecutive slots avoiding conflicts.
        - Otherwise, move to nearest free slot in same room if possible, else any room.
        """
        repaired = dict(individual)
        # Build student slot map
        student_to_slots = defaultdict(set)
        conflicts = []
        for class_id, slot in repaired.items():
            if slot not in self.time_slots:
                continue
            students = self.classes[class_id]['students']
            if slot in student_to_slots[students]:
                conflicts.append(class_id)
            student_to_slots[students].add(slot)

        # Try to resolve conflicts
        for class_id in conflicts:
            info = self.classes[class_id]
            students = info['students']
            part = info['part']
            room_id = info.get('room', '')
            if part == 'P':
                key = f"{info['course']}_{students}"
                pair = self.lab_pairs_by_group.get(key, [])
                if len(pair) == 2:
                    # search for consecutive slots with no student conflict and no room conflict
                    for day in range(5):
                        for start in range(self.periods_per_day - 1):
                            s1 = day * self.periods_per_day + start
                            s2 = s1 + 1
                            if s1 in self.reserved_slots or s2 in self.reserved_slots:
                                continue
                            # student free?
                            if s1 in student_to_slots[students] or s2 in student_to_slots[students]:
                                continue
                            # room free if room specified
                            if room_id:
                                # room conflicts check across repaired assignments
                                occupied = False
                                for cid2, slot2 in repaired.items():
                                    if cid2 in pair:
                                        continue
                                    if self.classes[cid2].get('room', '') == room_id and slot2 in (s1, s2):
                                        occupied = True
                                        break
                                if occupied:
                                    continue
                            repaired[pair[0]] = s1
                            repaired[pair[1]] = s2
                            student_to_slots[students].add(s1)
                            student_to_slots[students].add(s2)
                            break
                        else:
                            continue
                        break
            else:
                # Move single slot to earliest available non-reserved slot
                moved = False
                for day in range(5):
                    for period in range(self.periods_per_day):
                        s = day * self.periods_per_day + period
                        if s in self.reserved_slots:
                            continue
                        if s in student_to_slots[students]:
                            continue
                        # if room fixed, avoid room conflict
                        if room_id:
                            has_room_conflict = any(
                                self.classes[cx].get('room', '') == room_id and repaired[cx] == s
                                for cx in repaired if cx != class_id
                            )
                            if has_room_conflict:
                                continue
                        repaired[class_id] = s
                        student_to_slots[students].add(s)
                        moved = True
                        break
                    if moved:
                        break
        return repaired
    
    def save_timetable(self, individual, filename=None):
        """Save the timetable to CSV file"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"DTU_flexible_teacher_timetable_{timestamp}"
        
        csv_filename = f"{filename}.csv"
        with open(csv_filename, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['Class ID', 'Course', 'Part', 'Students', 'Day', 'Period', 'Room', 'Instructor', 'Instructor Name'])
            
            for class_id, time_slot in individual.items():
                class_info = self.classes[class_id]
                time_info = self.time_slots[time_slot]
                instructor_id = self.teacher_assignments.get(class_id, '')
                instructor_name = self.instructors.get(instructor_id, {}).get('name', 'Unknown')
                
                writer.writerow([
                    class_id,
                    class_info['course'],
                    class_info['part'],
                    class_info['students'],
                    time_info['day_name'],
                    time_info['period_name'],
                    class_info.get('room', ''),
                    instructor_id,
                    instructor_name
                ])
        
        print(f"Timetable saved to {csv_filename}")
        return csv_filename

    def save_html(self, individual, filename=None):
        """Save an HTML visualization for each student group (5x10 grid)"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"DTU_flexible_teacher_timetable_{timestamp}"

        html_filename = f"{filename}.html"

        # Build schedule per student group
        schedule_by_group = defaultdict(list)
        for class_id, time_slot in individual.items():
            class_info = self.classes[class_id]
            schedule_by_group[class_info['students']].append((class_id, class_info, time_slot))

        def slot_key(day_idx, period_idx):
            return day_idx * self.periods_per_day + period_idx

        # Begin HTML
        html_parts = []
        html_parts.append("<!DOCTYPE html>")
        html_parts.append("<html><head><meta charset='utf-8'><title>DTU Timetable</title>")
        html_parts.append("<style>body{font-family:Arial,Helvetica,sans-serif;margin:16px;}h2{margin-top:32px;}table{border-collapse:collapse;width:100%;margin-bottom:24px;}th,td{border:1px solid #ccc;padding:6px;font-size:12px;text-align:center;vertical-align:top;}th{background:#f6f6f6;}td.slot{height:64px;} .course{font-weight:bold;} .part{color:#333;} .room{color:#555;font-size:11px;} .inst{color:#006;border-top:1px dotted #ddd;margin-top:2px;padding-top:2px;font-size:11px;} .reserved{background:#ffe7cc;color:#8a4b00;} .legend{font-size:12px;color:#555;margin-bottom:8px;} .grid{table-layout:fixed;} .daycol{width:19%;} .periodrow th{width:8%;} </style>")
        html_parts.append("</head><body>")
        html_parts.append("<h1>DTU Timetable (Flexible Teachers)</h1>")
        html_parts.append("<div class='legend'>Reserved (AEC/VAC): Tuesday P1-P2, Thursday P1-P2</div>")

        days = self.days
        periods = self.periods

        for group, entries in sorted(schedule_by_group.items()):
            html_parts.append(f"<h2>Student Group: {group}</h2>")
            html_parts.append("<table class='grid'>")
            # Header
            html_parts.append("<tr class='periodrow'><th>Period</th>" + "".join([f"<th class='daycol'>{d}</th>" for d in days]) + "</tr>")
            # Build lookup
            cell_map = {}
            for class_id, class_info, time_slot in entries:
                if time_slot not in self.time_slots:
                    continue
                day_idx = self.time_slots[time_slot]['day']
                period_idx = self.time_slots[time_slot]['period']
                course = class_info['course']
                part = class_info['part']
                room = class_info.get('room', '')
                inst_id = self.teacher_assignments.get(class_id, '')
                inst_name = self.instructors.get(inst_id, {}).get('name', '')
                cell_map[(day_idx, period_idx)] = (course, part, room, inst_name)

            # Rows
            for p_idx, p_name in enumerate(periods):
                html_parts.append(f"<tr><th>{p_name}</th>")
                for d_idx, d_name in enumerate(days):
                    slot_id = slot_key(d_idx, p_idx)
                    reserved = slot_id in self.reserved_slots
                    if reserved:
                        html_parts.append("<td class='slot reserved'>AEC/VAC</td>")
                        continue
                    if (d_idx, p_idx) in cell_map:
                        course, part, room, inst_name = cell_map[(d_idx, p_idx)]
                        room_html = f"<div class='room'>{room}</div>" if room else ""
                        inst_html = f"<div class='inst'>{inst_name}</div>" if inst_name else ""
                        html_parts.append(f"<td class='slot'><div class='course'>{course}</div><div class='part'>({part})</div>{room_html}{inst_html}</td>")
                    else:
                        html_parts.append("<td class='slot'></td>")
                html_parts.append("</tr>")
            html_parts.append("</table>")

        html_parts.append("</body></html>")

        with open(html_filename, 'w') as f:
            f.write("\n".join(html_parts))

        print(f"HTML saved to {html_filename}")
        return html_filename

    def save_html_rich(self, individual, filename=None):
        """Generate rich per-section HTML similar to scheduler.py (tabs + grids)."""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"DTU_flexible_teacher_timetable_{timestamp}"

        html_filename = f"{filename}.html"

        # Build schedule map: students -> day -> period -> entry
        sections = sorted(set(info['students'] for info in self.classes.values()))
        schedule = {s: {d: {p+1: None for p in range(self.periods_per_day)} for d in self.days} for s in sections}

        for class_id, slot in individual.items():
            if slot not in self.time_slots:
                continue
            info = self.classes[class_id]
            day_name = self.time_slots[slot]['day_name']
            period_num = self.time_slots[slot]['period'] + 1
            room = info.get('room', '')
            inst = self.teacher_assignments.get(class_id, '')
            inst_name = self.instructors.get(inst, {}).get('name', '')
            entry = {
                'course': info['course'],
                'part': info['part'],
                'room': room,
                'instructor': inst_name
            }
            if info['students'] in schedule:
                schedule[info['students']][day_name][period_num] = entry

        # HTML head and styles (condensed from scheduler.py style)
        parts = []
        parts.append("<!DOCTYPE html>\n<html><head><meta charset='utf-8'><title>DTU Timetable</title>")
        parts.append("<style>body{font-family:Segoe UI,Arial,sans-serif;margin:0;background:#f3f5f7;} .container{max-width:1200px;margin:24px auto;background:#fff;border-radius:16px;box-shadow:0 12px 30px rgba(0,0,0,.08);overflow:hidden} .header{background:linear-gradient(135deg,#27ae60,#34495e);color:#fff;padding:28px;text-align:center} .tabs{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;background:#f8f9fa;padding:10px} .tab{padding:10px 16px;border-radius:10px;background:#fff;cursor:pointer;border:none;font-weight:600;color:#34495e;box-shadow:0 2px 6px rgba(0,0,0,.08)} .tab.active{background:#27ae60;color:#fff} .grid{display:grid;grid-template-columns:auto repeat(10,1fr);gap:2px;background:#dfe4ea;border-radius:8px;margin:16px} .cell{background:#fff;padding:8px;text-align:center;font-size:12px;min-height:62px} .head{background:#34495e;color:#fff;font-weight:700} .day{background:#27ae60;color:#fff;font-weight:700} .slot{background:#fff} .L{background:linear-gradient(135deg,#3498db,#2980b9);color:#fff} .P{background:linear-gradient(135deg,#e74c3c,#c0392b);color:#fff} .T{background:linear-gradient(135deg,#f39c12,#e67e22);color:#fff} .sub{font-weight:700;margin-bottom:2px} .room{font-size:11px;opacity:.95} .inst{font-size:10px;opacity:.9} .reserved{background:#ffe7cc;color:#8a4b00}</style>")
        parts.append("</head><body><div class='container'><div class='header'><h1>DTU Timetable</h1><div>Rich Visualization</div></div>")

        # Tabs
        parts.append("<div class='tabs'>")
        for i, sec in enumerate(sections):
            cls = 'tab active' if i == 0 else 'tab'
            parts.append(f"<button class='{cls}' onclick=\"show('{sec}')\">{sec}</button>")
        parts.append("</div>")

        # Section grids
        for i, sec in enumerate(sections):
            display = 'block' if i == 0 else 'none'
            parts.append(f"<div id='sec-{sec}' style='display:{display};padding:0 16px 16px'>")
            parts.append("<div class='grid'>")
            parts.append("<div class='cell head'>Day/Period</div>")
            for p in self.periods:
                parts.append(f"<div class='cell head'>{p}</div>")
            for d in self.days:
                parts.append(f"<div class='cell day'>{d}</div>")
                for pidx in range(1, self.periods_per_day+1):
                    # Reserved AEC/VAC
                    day_idx = self.days.index(d)
                    slot_id = day_idx * self.periods_per_day + (pidx-1)
                    if slot_id in self.reserved_slots:
                        parts.append("<div class='cell reserved'>AEC/VAC</div>")
                        continue
                    ent = schedule[sec][d][pidx]
                    if ent:
                        style = ent['part']
                        room_html = f"<div class='room'>{ent['room']}</div>" if ent['room'] else ""
                        inst_html = f"<div class='inst'>{ent['instructor']}</div>" if ent['instructor'] else ""
                        parts.append(f"<div class='cell {style}'><div class='sub'>{ent['course']}</div><div>({ent['part']})</div>{room_html}{inst_html}</div>")
                    else:
                        parts.append("<div class='cell slot'></div>")
            parts.append("</div></div>")

        # JS
        parts.append("<script>function show(id){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('[id^=sec-]').forEach(d=>d.style.display='none');const btn=[...document.querySelectorAll('.tab')].find(b=>b.textContent===id);if(btn)btn.classList.add('active');const sec=document.getElementById('sec-'+id);if(sec)sec.style.display='block';}</script>")
        parts.append("</div></body></html>")

        with open(html_filename, 'w') as f:
            f.write("\n".join(parts))
        print(f"HTML (rich) saved to {html_filename}")
        return html_filename

def main():
    parser = argparse.ArgumentParser(description="DTU Flexible Teacher Scheduler")
    parser.add_argument("xml_file", help="Path to merged.xml")
    parser.add_argument("--generations", type=int, default=500, help="Number of GA generations")
    parser.add_argument("--population", type=int, default=100, help="Population size")
    parser.add_argument("--save_html", action="store_true", help="Save HTML visualization")
    args = parser.parse_args()

    xml_file = args.xml_file
    scheduler = DTUFlexibleTeacherScheduler(xml_file, generations=args.generations, population_size=args.population)
    
    print("DTU Flexible Teacher Scheduler")
    print("=" * 50)
    print(f"XML file: {xml_file}")
    print(f"Days: {scheduler.days}")
    print(f"Periods per day: {scheduler.periods_per_day}")
    print(f"Total time slots: {len(scheduler.time_slots)}")
    print(f"Classes: {len(scheduler.classes)}")
    print(f"Rooms: {len(scheduler.rooms)}")
    print(f"Instructors: {len(scheduler.instructors)}")
    print(f"Students: {len(scheduler.students)}")
    print()
    
    # Show teacher assignment strategy
    print("Teacher Assignment Strategy:")
    print("- Lectures: One teacher per course-student group for whole week")
    print("- Tutorials: Can have different teacher from lectures")
    print("- Labs/Practicals: Can have different teacher from lectures/tutorials")
    print()
    
    # Run genetic algorithm
    best_individual, best_fitness = scheduler.run_genetic_algorithm()
    
    if best_individual:
        # Save timetable
        # Final repairs to target zero conflicts
        best_individual = scheduler.repair_room_conflicts(best_individual)
        best_individual = scheduler.repair_student_conflicts(best_individual)
        csv_file = scheduler.save_timetable(best_individual)
        print(f"Best timetable saved to {csv_file}")
        if args.save_html:
            base = csv_file[:-4]
            html_file = scheduler.save_html_rich(best_individual, filename=base)
            print(f"Best timetable HTML saved to {html_file}")
        else:
            base = csv_file[:-4]
        # Always produce validation summary JSON
        scheduler.print_and_save_validation(best_individual, base)
    else:
        print("No valid timetable found")

if __name__ == "__main__":
    main()
