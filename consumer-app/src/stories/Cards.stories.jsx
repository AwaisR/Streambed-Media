import React from "react";
import { Card, CardContent } from "../components/layouts/Card";

export default {
  title: "Layouts/Cards",
  component: Card,
};

export const CardWithContentWrapper = () => (
  <Card className="max-w-lg">
    <CardContent className="leading-6">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. 
      Quod inventore architecto quia, itaque, cumque eum dolore perferendis, 
      quam debitis aperiam voluptas. Necessitatibus quae esse quidem ipsum 
      distinctio? Reiciendis, quibusdam illo.
    </CardContent>
  </Card>
);

export const CardWithoutContentWrapper = () => (
  <Card className="max-w-lg">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
    Quod inventore architecto quia, itaque, cumque eum dolore perferendis, 
    quam debitis aperiam voluptas. Necessitatibus quae esse quidem ipsum 
    distinctio? Reiciendis, quibusdam illo.
  </Card>
);