
import { Label, TextInput, Checkbox, Button } from "flowbite-react";
const RoundedInputsCode = () => {
  return (
<div>
  
    <form className="flex flex-col gap-4">
      <div>
        <Label htmlFor="email1" className="block mb-2">Your email</Label>
        <TextInput
          id="email1"
          type="email"
          placeholder="name@matdash.com"
          required
          className="form-control-rounded"
        />
      </div>
      <div>
        <Label htmlFor="password1"  className="block mb-2">Your password</Label>
        <TextInput
          id="password1"
          type="password"
          required
          className="form-control-rounded"
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox className="checkbox" id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div>
      <Button type="submit" color="primary">
        Submit
      </Button>
    </form>
   
</div>

  );
};

export default RoundedInputsCode;
