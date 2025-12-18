import CodeDialog from 'src/components/ui-components/CodeDialog';
import SquareInput from './Codes/SquareInputsCode';
import SquareInputsCodes from './Codes/SquareInputsCode.tsx?raw';
import CardBox from 'src/components/shared/CardBox';

const SquareInputs = () => {
  return (
    <div>
      <CardBox className="p-0">
        <div className="p-6 ">
          <div>
            <h4 className="text-lg font-semibold mb-4">Square Inputs form</h4>
            <SquareInput />
          </div>
        </div>
        <CodeDialog>{SquareInputsCodes}</CodeDialog>
      </CardBox>
    </div>
  );
};

export default SquareInputs;
