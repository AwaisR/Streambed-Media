import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import format from "date-fns/format";
import gsap from "gsap";
import { styled } from "twin.macro";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Picker from "emoji-picker-react";

// components
import {
  Card,
  CardContent,
  CardFooter,
} from "../../../components/layouts/Card";
import RoundedInput from "../../../components/forms/RoundedInput";
import Select from "../../../components/forms/Select";
import Textarea from "../../../components/forms/Textarea";
import Checkbox from "../../../components/forms/Checkbox";

// icons
import CheckIcon from "../../../components/icons/CheckIcon";
import ArrowRightIcon from "../../../components/icons/ArrowRightIcon";
import BrowserIcon from "../../../components/icons/BrowserIcon";
import ZoomIcon from "../../../components/icons/ZoomIcon";
import RotatedBarChartIcon from "../../../components/icons/RotatedBarChartIcon";
import SmileyIcon from "../../../components/icons/SmileyIcon";
import CalendarWithTimeIcon from "../../../components/icons/CalendarWithTimeIcon";
import PlusCircleIcon from "../../../components/icons/PlusCircleIcon";
import MinusCircleIcon from "../../../components/icons/MinusCircleIcon";

// utils
import { PLATFORM_ICON_MAP } from "../../../components/helpers/platforms";

// seed
import instagramPosts from "../../seed/instagramPosts";

const NEXT_BUTTON_INACTIVE_CLASSNAME =
  "bg-gray-300 border-transparent text-copy cursor-default";
const NEXT_BUTTON_ACTIVE_CLASSNAME =
  "border-primary text-primary cursor-pointer hover:bg-primary hover:text-white";
const NEXT_BUTTON_DEFAULT_CLASSNAME =
  "flex items-center justify-center px-3 py-1 rounded-xl border";

