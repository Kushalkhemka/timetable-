# Timetable Creation  (GIVE HTML CODE, use reasoning to generate timetable HTML)







## 1) UNIVERSITY / General information



- COLLEGE days: **Monday — Friday**



- college hours: **10:00 AM — 06:00 PM**



- Period length: **60 minutes**







- Use the daily break pattern as needed (for solver: include a short break and a 60-minute lunch break in the schedule where required), but instructional periods must be 60 minutes long.



- Output format required: For **each Class Section** produce a timetable table whose **rows** are the days (Mon–Fri) and **columns** are the numbered periods (Period 1, Period 2, …). 







## 2) Classes / Sections / Students



- There are **7 class sections** named **Section A, Section B, Section C, Section D, Section E, Section F, Section G**.



- Each section has **75 students**.



- For **lab sessions**, each section’s students should be split into **3 groups of 25 students** (Group 1, Group 2, Group 3) when attending laboratories.







## 3) Subjects (renamed)



- **Theory subjects (5):**



  - **DAA** (Design and Analysis of Algorithms)



  - **OS**  (Operating Systems)



  - **OOPS** (Object Oriented Programming Systems)



  - **DLD** (Digital Logic Design)



  - **SE**  (Software Engineering)







- **Practical subjects with labs (3):**



  - **Lab_P1** (DAA Lab)



  - **Lab_P2** (OS Lab)



  - **Lab_P3** (OOPS Lab)







  Each practical subject requires a lab room and must be scheduled so that students attend in groups of 25.







## 4) Teachers (randomly assigned names)



> Note: teacher IDs use a compact naming scheme: `T_<subject>_<A/B/C/...>`. These are distinct individuals and represent teacher resources the solver must treat as unavailable when double-booked.







### Theory teachers (2–3 per theory subject)



- **DAA**



  - `T_DAA_A` — Dr. Amit Verma



  - `T_DAA_B` — Prof. Rina Kapoor



  - `T_DAA_C` — Mr. Sameer Joshi







- **OS**



  - `T_OS_A` — Dr. Nisha Rao



  - `T_OS_B` — Mr. Vikram Patel



  - `T_OS_C` — Ms. Anaya Singh







- **OOPS**



  - `T_OOPS_A` — Prof. Rahul Mehta



  - `T_OOPS_B` — Ms. Pooja Iyer



  - `T_OOPS_C` — Mr. Harsh Malhotra







- **DLD**



  - `T_DLD_A` — Dr. Kavita Sharma



  - `T_DLD_B` — Mr. Aditya Sen







- **SE**



  - `T_SE_A` — Prof. Leena Gupta



  - `T_SE_B` — Mr. Mohit Chandra







*(Total theory teachers listed: 13 — within required 10–15 range.)*







### Lab teachers (3 per lab subject — 9 total)



- **Lab_P1 (DAA Lab)**



  - `T_P1_A` — Lab Instructor: Ms. Richa Desai



  - `T_P1_B` — Lab Instructor: Mr. Karan Bose



  - `T_P1_C` — Lab Instructor: Ms. Smita Rao







- **Lab_P2 (OS Lab)**



  - `T_P2_A` — Lab Instructor: Mr. Arjun Nair



  - `T_P2_B` — Lab Instructor: Ms. Divya Kulkarni



  - `T_P2_C` — Lab Instructor: Mr. Sandeep Goyal







- **Lab_P3 (OOPS Lab)**



  - `T_P3_A` — Lab Instructor: Ms. Neha Bhatia



  - `T_P3_B` — Lab Instructor: Mr. Raghav Iqbal



  - `T_P3_C` — Lab Instructor: Ms. Tara Menon







## 5) Rooms & capacities



- **Theory classrooms:** At least **7 classrooms** (e.g., `Rm101`..`Rm107`) each with **capacity ≥ 75**.



- **Lab rooms:** At least **3 lab rooms** (e.g., `Lab1`, `Lab2`, `Lab3`) each with capacity **25** and equipped for the respective lab (Lab1 → Lab_P1 equipment, Lab2 → Lab_P2, Lab3 → Lab_P3).







## 6) Teaching load (weekly requirement per section)



- Per **Section (A–G)**, weekly periods required:



  - **DAA:** 4 periods/week



  - **OS:** 4 periods/week



  - **OOPS:** 3 periods/week



  - **DLD:** 3 periods/week



  - **SE:** 3 periods/week



  - **Lab_P1 (DAA Lab):** 1 lab periods/week (see Lab scheduling rules)



  - **Lab_P2 (OS Lab):** 1 lab periods/week



  - **Lab_P3 (OOPS Lab):** 1 lab periods/week







## 7) Lab scheduling rules (interpreted for solver)



- Each lab session is attended by **one group of 25 students** in one lab room with one lab teacher.



- For each section and each lab subject the solver must ensure that **all 3 groups receive the required lab sessions** across the week. (Solver should create group-subslots so each group's lab time requirement across the week is satisfied — e.g., using parallel lab rooms or different periods.)



- Lab teachers: For each lab subject there are **3 lab teachers**; solver may rotate groups among these teachers or fix teachers to rooms depending on availability constraints.







## 8) Hard Constraints (HC) — must be satisfied



- **HC1:** No student assigned more than one class at same time (labs and theory included).



- **HC2:** Room must satisfy course features (lab equipment matches course).



- **HC3:** Number of students attending ≤ room capacity.



- **HC4:** No more than one course in each room at the same time.



- **HC5:** Courses assigned only to allowed time slots (based on teacher/room availability).



- **HC6:** Prescribed ordering of sessions must be preserved where applicable.



- **HC7:** All required lectures/lab sessions for each course/section must be scheduled in the week.



- **HC8:** No teacher double-booking; lectures of courses taught by same teacher must be in different periods.



- **HC9:** Teacher unavailability periods (if any) must be respected.



-**HC10:** Spread the timetable free slots dynamically, it should be not fixed. 







## 9) Soft Constraints (SC) — optimize but can be violated with penalty



- **SC1:** Avoid single-course days for a student (prefer ≥2 periods/day).



- **SC2:** Minimize more than two consecutive periods for students.



- **SC3:** Prefer not to schedule courses in final slot of the day.



- **SC4:** Prefer satisfying room capacity (penalize violations).



- **SC5:** Spread lectures across days (avoid clustering).



- **SC6:** Favor adjacency of curriculum lectures when beneficial.



- **SC7:** Prefer same room for all lectures of a course (minimize room switching).







## 10) Additional solver preferences & operational rules



- Do not schedule the same subject twice on the same day for a section (except explicit block rules).



- Distribute teacher loads among available teachers while respecting availability.



- Assign theory lectures to theory classrooms (≥75). Assign lab group meetings to lab rooms (25).



- Labs from different sections may run in parallel if distinct lab rooms and different lab teachers are used.



- **Output expectations:** For each Section (A–G) provide:



  - A timetable table (Mon–Fri rows, Periods columns) showing `Subject — Teacher — Room`. For lab sessions indicate group, e.g., `Lab_P1 (Group 2) — T_P1_B — Lab2`.



  - A summary of weekly totals per subject to verify requirement satisfaction.



  - A teacher assignment summary (how many periods each teacher is assigned and where).



  - A room utilization summary (periods used per room).







## 11) Example of required output table cell notation



- `DAA — T_DAA_A — Rm101`



- `Lab_P2 (Group 3) — T_P2_C — Lab2`







## 12) Edge cases & solver clarity



- If the solver cannot schedule all required lectures while satisfying all hard constraints, report which HC was violated and why (for example: insufficient lab-room capacity at required times).



- To change weekly counts, teacher availability, or number of rooms, re-run the prompt with updated parameters.







---



### Short summary of resources created (for quick reference)



- **Theory subjects:** DAA, OS, OOPS, DLD, SE



- **Theory teachers:** `T_DAA_A/B/C`, `T_OS_A/B/C`, `T_OOPS_A/B/C`, `T_DLD_A/B`, `T_SE_A/B`



- **Lab teachers:** `T_P1_A/B/C` (DAA Lab), `T_P2_A/B/C` (OS Lab), `T_P3_A/B/C` (OOPS Lab)



- **Rooms:** `Rm101`..`Rm107` (theory, cap ≥75), `Lab1`..`Lab3` (cap 25 with specific equipment)







keep dynamic free slots like monday and tuesday have different free slots timings and so on, not like school but i need for college, don;'t use explicit js logic, use your reasoning to spit our timetable , parse it to make html visualization

You can't keep three LABS together back to back, also don't keep lunch slot fixed make it free and spread dynamically and also LAB slot is each of 2 hour each



Also with the html you give, include the script to validate the constraint so that there is no clashes