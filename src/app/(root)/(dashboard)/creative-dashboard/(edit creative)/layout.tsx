import {Actions} from '@/src/components/export_components';
import React from 'react'

const editLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bodyMargin text-textColor flex flex-col gap-5 my-5 md:pt-5">
      {" "}
      <div className=" md:hidden ">
        <Actions />
      </div>
      <div className="flex  ">
        <div className="flex-2/7 max-md:hidden ">
          <Actions />
        </div>
        <div className="flex-5/7 md:mx-5">{children}</div>
      </div>
    </main>
  );
};

export default editLayout;

