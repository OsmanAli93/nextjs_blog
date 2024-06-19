"use client";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { LOGOUT_USER } from "../../constants";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "../../services/axiosInstance";

const Header = ({ access_token, user, logout }) => {
  const navigate = useRouter();
  console.log(user);

  const setDefaultHeaders = (access_token) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  return (
    <Navbar rounded>
      <Navbar.Brand href="/">
        <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Flowbite React
        </span>
      </Navbar.Brand>
      {!access_token && !user ? (
        <Navbar.Toggle />
      ) : (
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={true}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user?.name}</span>
              <span className="block truncate text-sm font-medium">
                {user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => {
                setDefaultHeaders(access_token);
                logout(navigate);
              }}
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>

          <Navbar.Toggle />
        </div>
      )}

      <Navbar.Collapse>
        <Navbar.Link as={"div"}>
          <Link href="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"}>
          <Link href="#">About</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"}>
          <Link href="#">Services</Link>
        </Navbar.Link>
        <Navbar.Link as="div">
          <Link href="#">Pricing</Link>
        </Navbar.Link>
        <Navbar.Link as="div">
          <Link href="#">Contact</Link>
        </Navbar.Link>
        {!access_token && !user ? (
          <Navbar.Link as="div">
            <Link
              href="/auth/login"
              className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Login
            </Link>
          </Navbar.Link>
        ) : (
          <Navbar.Link as="div">
            <Link href="#">Post</Link>
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = (state) => {
  return {
    access_token: state.auth.access_token,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (navigate) => dispatch({ type: LOGOUT_USER, navigate }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
