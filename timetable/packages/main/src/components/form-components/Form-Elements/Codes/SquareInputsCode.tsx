import { Label, TextInput, Checkbox, Button } from 'flowbite-react';

const SquareInputsCode = () => {
  return (
    <div>
      <form className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email1" className="block mb-2">
            Your email
          </Label>
          <TextInput
            id="email1"
            type="email"
            placeholder="name@matdash.com"
            required
            className="form-rounded-md"
          />
        </div>
        <div>
          <Label htmlFor="password1" className="block mb-2">
            Your password
          </Label>
          <TextInput id="password1" type="password" required className="form-rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox className="checkbox" id="remember1" />
          <Label htmlFor="remember1">Remember me</Label>
        </div>
        <Button type="submit" className="rounded-md" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default SquareInputsCode;
