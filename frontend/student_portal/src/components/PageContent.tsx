
import Exercise1_0001 from "@/pages/exercises/exercise1_0001";
import Exercise1_0002 from "@/pages/exercises/exercise1_0002";
import Exercise1_0003 from "@/pages/exercises/exercise1_0003";
import Exercise2_0001 from "@/pages/exercises/exercise2_0001";
import Exercise2_0002 from "@/pages/exercises/exercise2_0002";
import Exercise2_0003 from "@/pages/exercises/exercise2_0003";
import Exercise2_0004 from "@/pages/exercises/exercise2_0004";
import Exercise3_0001 from "@/pages/exercises/exercise3_0001";
import Exercise3_0002 from "@/pages/exercises/exercise3_0002";
import Exercise3_0003 from "@/pages/exercises/exercise3_0003";
import Exercise3_0004 from "@/pages/exercises/exercise3_0004";
import Learning1_0001 from "@/pages/lessons/learning1_0001";
import Learning1_0002 from "@/pages/lessons/learning1_0002";
import Learning2_0001 from "@/pages/lessons/learning2_0001";
import Learning3_0001 from "@/pages/lessons/learning3_0001";
import React from "react";

const PageContent: React.FC<{ id: string | undefined }> = ({ id }) => {
    switch (id) {
        case "0001L0001":
            return <Learning1_0001 />;
        case "0001L0002":
            return <Learning1_0002 />;
        case "0002L0001":
            return <Learning2_0001 />;
        case "0003L0001":
            return <Learning3_0001 />;
        case "0001E0001":
            return <Exercise1_0001 />;
        case "0001E0002":
            return <Exercise1_0002 />;
        case "0001E0003":
            return <Exercise1_0003 />;
        case "0002E0001":
            return <Exercise2_0001 />;
        case "0002E0002":
            return <Exercise2_0002 />;
        case "0002E0003":
            return <Exercise2_0003 />;
        case "0002E0004":
            return <Exercise2_0004 />;
        case "0003E0001":
            return <Exercise3_0001 />;
        case "0003E0002":
            return <Exercise3_0002 />;
        case "0003E0003":
            return <Exercise3_0003 />;
        case "0003E0004":
            return <Exercise3_0004 />;
        default:
            return <Learning1_0001 />;
    }
}
export default PageContent;