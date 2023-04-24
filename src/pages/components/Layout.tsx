import React, { PropsWithChildren } from "react";
import NavBar from "./NavBar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
