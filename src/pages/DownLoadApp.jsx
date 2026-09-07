import PhoneVersion from "../../public/PhoneVersion.jpg";
const DownLoadApp = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-y-4 min-h-screen w-screen ">
      <div className="h-[20%] flex justify-center items-center">
        <h1 className="text-[10vh]">En cours de devéloppement</h1>
      </div>
      <div className="h-[90%] w-[90%] flex justify-center items-center">
        <img src={PhoneVersion} alt="Notre version Mobile" srcset="" />
      </div>
    </div>
  );
};

export default DownLoadApp;
