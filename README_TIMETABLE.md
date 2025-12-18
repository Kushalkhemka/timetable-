# Timetable Generation System

This system allows you to upload XML timetable data and automatically generate optimized schedules using a genetic algorithm.

## Features

- **XML Upload**: Upload timetable XML files through the web interface
- **Automatic Generation**: Uses a genetic algorithm to optimize teacher assignments
- **Multiple Output Formats**: Generates both CSV and HTML outputs
- **Real-time Processing**: Upload and generate timetables instantly

## How to Use

### 1. Start the Backend Server

```bash
cd server
npm install
npm run dev
```

The server will start on `http://localhost:5055`

### 2. Start the Frontend Application

```bash
cd spike-react-tailwind/packages/starterkit
npm install
npm run dev
```

### 3. Upload and Generate Timetable

1. Open the Timetable Generation page
2. Go to the "General Settings" tab
3. Upload your XML file using the "Upload Timetable Data" section
4. Click "Generate Timetable"
5. View results in the "Review & Generate" tab

## XML File Format

The system expects XML files in the following format:

```xml
<?xml version='1.0' encoding='utf-8'?>
<problem name="your-timetable" nrDays="5" nrWeeks="16" slotsPerDay="10">
  <optimization time="25" room="1" distribution="15" student="100" />
  <rooms>
    <room id="ROOM-1" capacity="100" />
    <room id="LAB-1" capacity="50" type="lab" course="CS101" />
  </rooms>
  <instructors>
    <instructor id="1" name="John Doe" department="CS" />
  </instructors>
  <courses>
    <course id="CS101" name="Programming" />
  </courses>
  <classes>
    <class id="CS-A" name="Computer Science A" />
  </classes>
  <lessons>
    <lesson id="1" course="CS101" class="CS-A" instructor="1" room="LAB-1" periods="3" />
  </lessons>
</problem>
```

## Output Files

After generation, the system creates:

- **CSV File**: `DTU_flexible_teacher_timetable_YYYYMMDD_HHMMSS.csv`
- **HTML File**: `DTU_flexible_teacher_timetable_YYYYMMDD_HHMMSS.html`
- **Validation File**: `DTU_flexible_teacher_timetable_YYYYMMDD_HHMMSS_validation.json`

## API Endpoints

- `GET /health` - Health check
- `POST /api/generate` - Upload XML and generate timetable

## Algorithm Parameters

The genetic algorithm uses these default parameters:
- Generations: 300
- Population Size: 120
- Optimization weights: Time (25), Room (1), Distribution (15), Student (100)

You can modify these in the backend server code if needed.

## Troubleshooting

1. **Server won't start**: Make sure all dependencies are installed with `npm install`
2. **Python script not found**: Ensure `scheduler_flexible_teachers.py` is in the project root
3. **Generation fails**: Check the console for error messages and ensure your XML file is valid
4. **No output files**: The algorithm may not have found a valid solution - try adjusting parameters or constraints

## Example XML File

See `merged.xml` for a complete example of the expected XML format.


