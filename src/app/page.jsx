"use client";
import React from "react";
import { connect } from "react-redux";
import Posts from "../components/Posts/Posts";
import Toast from "../components/Toast/Toast";

const Home = ({ success }) => {
  console.log(success);
  return (
    <section className="py-[90px]">
      <div className="container">
        <Posts />
      </div>

      {success !== "" && <Toast success={true} message={success} />}
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    success: state.auth.successMessage,
  };
};

export default connect(mapStateToProps)(Home);
