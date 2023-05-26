import { type UserReview } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import ReviewCard from "@/components/ReviewCard";
import { useMe } from "@/hooks/useMe";
import AccountLayout from "@/layouts/AccountLayout";
import { apiClient } from "@/utils/api";

export default function ReviewsPage() {
  const { status } = useSession();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const me = useMe();

  useEffect(() => {
    const fetchUserData = async () => {
      const results = await apiClient.users.reviews.query();
      if (results) {
        setReviews(results.reviews);
      }
    };
    if (status === "authenticated") {
      void fetchUserData();
    }
  }, []);

  return (
    <>
      {me !== false && (
        <AccountLayout selectedOption="general" role={me.user_role.name}>
          {reviews.length === 0 && (
            <h4 className="mb-8 text-3xl font-bold text-white">
              У вас пока нет отзывов.
            </h4>
          )}
          {reviews.length > 0 && (
            <>
              <h4 className="mb-8 text-3xl font-bold text-white">Мои отзывы</h4>
              <div className="">
                {reviews.map((item) => (
                  <ReviewCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </AccountLayout>
      )}
    </>
  );
}
