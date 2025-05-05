"use server";

import { UserManagement } from "@/components/admin/users/content-data";


const Page = async () => {
  
  return (
    <div className="flex flex-col w-full h-full">
      <UserManagement />
    </div>
  );
};

export default Page;
