
import Grid4x4Icon from '@mui/icons-material/Grid4x4';

export default function AcmeLogo() {


  return (
    <div>
      <div className={`flex flex-row items-center leading-none text-white space-x-7`}>
        <Grid4x4Icon className="h-10 w-10 rotate-[15deg]" />
        <p className="text-xl space-x-11">GridWise </p>
      </div>
    </div>
  );
}