import { type UserReview } from "@prisma/client";
import Image from "next/image";
import { Rating } from "primereact/rating";
import { useState } from "react";

export default function ReviewCard({ item }: { item: UserReview }) {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="mb-4 grid grid-cols-4 gap-x-8 gap-y-6 rounded-2xl bg-cs-dark-800 px-4 py-6">
      <Image
        src="https://static.my.ge/myhome/photos/7/7/2/3/2/large/13823277_6.jpg?v=11"
        alt=""
        width={200}
        height={130}
        className="col-span-1 h-32 w-48"
      />
      <div className="col-span-3">
        <h5 className="text-lg font-medium text-white">{item.title}</h5>
        <Rating value={item.rating} readOnly cancel={false} />
        {item.text && (
          <>
            <p className="mb-3">
              {showMore ? item.text : item.text.substring(0, 160) + "..."}
            </p>
            <p
              className="cursor-pointer text-cs-secondary underline"
              onClick={() => {
                setShowMore(!showMore);
              }}
            >
              {showMore ? "Свернуть" : "Развернуть..."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
