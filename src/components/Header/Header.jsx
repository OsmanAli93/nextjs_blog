"use client";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Avatar, Dropdown, Navbar } from "flowbite-react";

const Header = () => {
  const [user, setUser] = useState(null);

  return (
    <Navbar rounded>
      <Navbar.Brand href="#">
        <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Flowbite React
        </span>
      </Navbar.Brand>
      {user === null ? (
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
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">
                name@flowbite.com
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>

          <Navbar.Toggle />
        </div>
      )}

      <Navbar.Collapse>
        <Navbar.Link href="#">Home</Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
        {user === null && <Navbar.Link href="/auth/login">Login</Navbar.Link>}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
