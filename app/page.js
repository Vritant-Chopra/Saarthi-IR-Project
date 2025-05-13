import Landing from "./landing/page";

import { Cursor } from 'react-creative-cursor';
import 'react-creative-cursor/dist/styles.css';

export default function Home() {
  return (
    <div className="h-screen bg w-full relative">
      <Landing />
    </div>
  );
}
