import CardBox from 'src/components/shared/CardBox';
import RoundedInput from './Codes/RoundedInputsCode';
import RoundedInputcode from './Codes/RoundedInputsCode.tsx?raw';
import CodeDialog from 'src/components/ui-components/CodeDialog';

const RoundedInputs = () => {
  return (
    <div>
      <CardBox className='p-0'>
        <div className='p-6 '>
          <div >
            <h4 className="text-lg font-semibold mb-4">Rounded Inputs form</h4>
            <RoundedInput />
          </div>
          
        </div>
        <CodeDialog>{RoundedInputcode}</CodeDialog>
      </CardBox>
    </div>
  );
};

export default RoundedInputs;
