// import { Button } from "@/components/ui/button"

// export default function Home() {
//   return (
//     <>
//       <Button>Test</Button>
//     </>
//   );
// }

import { redirect } from 'next/navigation';

export default function Home() {
  //return <div>Loading...</div>;

  redirect('/login');
}
