import React from "react";
import Image from "next/image";

interface propType {
  className: string;
}
const MadeByportgig = ({ className }: propType) => {
  return (
    <footer className={`center px-10 py-40 ${className}`}>
      <Image
        src={"/assets/madeByPortgig.svg"}
        height={200}
        width={1000}
        alt="made by portgig"
      />
    </footer>
  );
};

export default MadeByportgig;
