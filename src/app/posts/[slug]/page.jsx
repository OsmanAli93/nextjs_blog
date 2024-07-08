"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";

const Article = () => {
  const { slug } = useParams();

  useEffect(() => {
    console.log(slug);
  }, [slug]);

  return (
    <section>
      <div className="container">{slug}</div>
    </section>
  );
};

export default Article;
