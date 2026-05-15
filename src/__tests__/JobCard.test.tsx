import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("lucide-react", () => ({
  AlertCircle: () => <div data-testid="icon-alert" />,
  ArrowRight: () => <div data-testid="icon-arrow" />,
  CheckCircle2: () => <div data-testid="icon-check" />,
  FileText: () => <div data-testid="icon-file" />,
  MapPin: () => <div data-testid="icon-map" />,
  Users: () => <div data-testid="icon-users" />,
}));

import { JobCard } from "../components/jobs/JobCard";
import type { Job } from "../types";

// Mock the framer-motion module so tests run without animation issues
jest.mock("motion/react", () => {
  const actual = jest.requireActual("motion/react");
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

const mockJob: Job = {
  id: "job-001",
  title: "Frontend Developer",
  location: "Remote",
  employmentType: "Full-time",
  description: "Build delightful interfaces.",
};

describe("JobCard Component", () => {
  it("renders job title and location", () => {
    render(<JobCard job={mockJob} applicantCount={0} hasScreening={false} />);
    
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText("Build delightful interfaces.")).toBeInTheDocument();
  });

  it("displays the correct applicant count", () => {
    render(<JobCard job={mockJob} applicantCount={5} hasScreening={false} />);
    
    expect(screen.getByText(/5 applicants screened/i)).toBeInTheDocument();
  });

  it("displays 'Active' badge when screening is present", () => {
    render(<JobCard job={mockJob} applicantCount={0} hasScreening={true} />);
    
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.queryByText("No screening")).not.toBeInTheDocument();
  });

  it("displays 'No screening' badge when no screening is present", () => {
    render(<JobCard job={mockJob} applicantCount={0} hasScreening={false} />);
    
    expect(screen.getByText("No screening")).toBeInTheDocument();
    expect(screen.queryByText("Active")).not.toBeInTheDocument();
  });
});
