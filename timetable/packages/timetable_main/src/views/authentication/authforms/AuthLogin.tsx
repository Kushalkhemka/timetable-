import { useState } from "react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "src/context/AuthContext";

type AuthLoginProps = {
  redirectPath?: string;
};

const AuthLogin = ({ redirectPath = '/' }: AuthLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signInWithEmailPassword, role } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await signInWithEmailPassword(email, password);
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (redirectPath && redirectPath !== "/") {
      navigate(redirectPath);
      return;
    }
    if (role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (role === 'student') {
      navigate('/student');
    } else if (role === 'admin') {
      navigate('/');
    } else {
      // Default to student dashboard if role not set
      navigate('/student');
    }
  }

  return (
    <>
      <form className="mt-6" onSubmit={onSubmit}>
        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="email">Email</Label>
          </div>
          <TextInput
            id="email"
            type="email"
            sizing="md"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="userpwd">Password</Label>
          </div>
          <TextInput
            id="userpwd"
            type="password"
            sizing="md"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-between my-7">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remeber this Device
            </Label>
          </div>
          <Link to={"/auth/auth1/forgot-password"} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link>
        </div>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <Button type="submit" color={"primary"} size="lg" className="w-full" isProcessing={submitting} disabled={submitting}>
          Sign in
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
