import React from "react";

import { Card, CardContent } from "../../components/layouts/Card";

// icons
import LogoIcon from "../../components/icons/LogoIcon";

const LogoSidebar = () => {
  return (
    <Card className="rounded-l-none h-screen hidden lg:block lg:w-96">
      <CardContent className="h-full flex items-center justify-center">
        <LogoIcon className="transform scale-150" />
      </CardContent>
    </Card>
  );
};

export default LogoSidebar;