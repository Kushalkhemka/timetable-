import { useState } from 'react';
import { Link } from 'react-router';
import { Button, Label, Select, TextInput } from 'flowbite-react';
import CardBox from 'src/components/shared/CardBox';
import FullLogo from 'src/layouts/full/shared/logo/FullLogo';
import { useAuth } from 'src/context/AuthContext';
import { facultyService } from 'src/services/facultyService';

const specializations = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Electrical',
  'Mechanical',
  'Civil',
  'Mathematics',
  'Physics',
  'Chemistry',
];

const TeacherRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instructorId, setInstructorId] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('Professor');
  const [specialization, setSpecialization] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signUpWithEmailPassword } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const { error: err } = await signUpWithEmailPassword(email, password, 'teacher');
    if (err) {
      setSubmitting(false);
      setError(err.message);
      return;
    }
    // Create faculty profile row (best-effort, ignore errors)
    await facultyService.addFaculty({
      instructor_id: instructorId ? Number(instructorId) : undefined,
      name: teacherName || email.split('@')[0],
      email,
      department: '',
      designation,
      specialization,
      is_active: true,
    });
    setSubmitting(false);
    setSuccess('Check your email for a confirmation link.');
  }

  return (
    <>
      <div className="relative min-h-screen flex flex-col justify-center bg-lightinfo/50">
        <div className="flex h-full justify-center items-center px-4 relative !z-20">
          <CardBox className="xl:max-w-6xl lg:max-w-3xl md:max-w-xl w-full border-none p-0 !shadow-elevation4">
            <div className="p-6">
              <FullLogo />
            </div>
            <div className="grid grid-cols-12 items-center justify-center">
              <div className="xl:col-span-6 col-span-12 xl:block hidden px-8">
                <img src="/DTU_LOGO.png" alt="DTU Logo" className="mx-auto h-94 w-94 object-contain" />
              </div>
              <div className="xl:col-span-6 col-span-12 xl:px-8 px-6">
                <div className="lg:px-6 pb-8">
                  <h3 className="text-3xl font-bold mb-3">Teacher Sign up</h3>
                  <p className="text-base text-ld">Create your Teacher account</p>

                  <form className="mt-6" onSubmit={onSubmit}>
                    <div className="mb-6">
                      <div className="mb-2 block">
                        <Label htmlFor="email">Email</Label>
                      </div>
                      <TextInput id="email" type="email" sizing="md" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="mb-6">
                      <div className="mb-2 block">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <TextInput id="password" type="password" sizing="md" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <div className="mb-6">
                      <div className="mb-2 block">
                        <Label htmlFor="instructorId">Instructor ID</Label>
                      </div>
                      <TextInput id="instructorId" type="text" sizing="md" className="form-control" value={instructorId} onChange={(e) => setInstructorId(e.target.value)} />
                    </div>

                    <div className="mb-6">
                      <div className="mb-2 block">
                        <Label htmlFor="teacherName">Teacher Name</Label>
                      </div>
                      <TextInput id="teacherName" type="text" sizing="md" className="form-control" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
                    </div>

                    <div className="mb-6">
                      <div className="mb-2 block">
                        <Label htmlFor="designation">Designation</Label>
                      </div>
                      <Select id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)}>
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Lecturer">Lecturer</option>
                      </Select>
                    </div>

                    <div className="mb-6">
                      <div className="mb-2 block">
                        <Label htmlFor="specialization">Specialization</Label>
                      </div>
                      <Select id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                        <option value="">Select specialization</option>
                        {specializations.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </Select>
                    </div>

                    {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                    {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
                    <Button type="submit" color="primary" size="lg" className="w-full" isProcessing={submitting} disabled={submitting}>
                      Sign Up
                    </Button>
                  </form>

                  <div className="flex gap-2 text-sm dark:text-white font-medium mt-6 items-center ">
                    <p>Already have an Account</p>
                    <Link to={'/auth/auth1/teacher-login'} className="text-primary text-sm font-medium ">
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default TeacherRegister;


