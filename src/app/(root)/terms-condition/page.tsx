import { termsAndConditions } from "@/src/constants";
import React from "react";

const TermsCondition = () => {
  return (
    <main className="text-black  my-10">
      <div className="bg-gray200 center-flexCol py-7">
        <h2 className="heading">Terms and Condition</h2>
        <h2 className="text-xs md:text-sm lg:text-lg">
          Home <span className="text-textColor"> &gt; terms and Condition</span>
        </h2>
      </div>
      <div className="flex flex-col gap-10 py-10 bodyMargin">
        <div className="flex flex-col gap-5">
          <ol className="smallHeading list-none flex flex-col gap-5">
            {termsAndConditions.map((terms, index) => (
              <li key={index} className="flex flex-col gap-2">
                <h2 className="smallHeading">{`${index + 1}.0 ${
                  terms.heading
                }`}</h2>
                <ol className="space-y-[2px] list-none pl-4">
                  {terms.content.map((content, subIndex) => (
                    <li key={subIndex}>
                      <p className="text-xs sm:text-sm lg:text-lg font-normal">
                        {`${index + 1}.${subIndex + 1} ${content}`}
                      </p>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
        {/* 2 */}

        {/* 3 */}
        <div className="flex flex-col gap-5">
          <p>
            <strong>Email:</strong> portgig@gmail.com
          </p>
          <p>
            <strong>Website:</strong> portgig.com
          </p>
          <p>Thank you for visiting Portgig. Your privacy matters to us!</p>
        </div>
      </div>
    </main>
  );
};

export default TermsCondition;
