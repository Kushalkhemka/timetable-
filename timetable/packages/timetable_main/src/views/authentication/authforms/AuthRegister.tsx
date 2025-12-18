import { useState } from 'react';
import { Button, Label, Select, TextInput } from 'flowbite-react';
import { useAuth } from 'src/context/AuthContext';

const AuthRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [role, setRole] = useState<'teacher' | 'admin' | 'student'>('teacher');
  const { signUpWithEmailPassword } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const { error: err } = await signUpWithEmailPassword(email, password, role, firstName, lastName);
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess('Check your email for a confirmation link.');
  }

  return (
    <>
      <form className="mt-6" onSubmit={onSubmit}>
        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="firstName">First Name</Label>
          </div>
          <TextInput id="firstName" type="text" sizing="md" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>

        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="lastName">Last Name</Label>
          </div>
          <TextInput id="lastName" type="text" sizing="md" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>

        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="emadd">Email Address</Label>
          </div>
          <TextInput id="emadd" type="email" sizing="md" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="userpwd">Password</Label>
          </div>
          <TextInput id="userpwd" type="password" sizing="md" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="role">Role</Label>
          </div>
          <Select id="role" value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </Select>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
        <Button type="submit" color="primary" size="lg" className="w-full" isProcessing={submitting} disabled={submitting}>
          Sign Up
        </Button>
      </form>
    </>
  );
};

export default AuthRegister;
