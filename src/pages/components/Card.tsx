import React, { PropsWithChildren } from "react";

const Card: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col py-6 px-5 mb-3 border-2">{children}</div>
);

export default Card;
