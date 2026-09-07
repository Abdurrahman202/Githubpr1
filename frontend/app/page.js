"use client";

import { useState } from "react";
import Link from "next/link";

const features = [
  ["01", "Simple task flow", "Move work from idea to done without unnecessary complexity."],
  ["02", "Clear ownership", "See who created each task and who is responsible for it."],
  ["03", "Built for teams", "A role-aware experience for normal users and administrators."]
];

export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="top-nav container-fluid px-4 px-lg-5">
        <div className="brand-mark">
          <span className="brand-dot" />
          <span>TaskFlow</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Link className="btn btn-link nav-link-clean" href="/login">Sign in</Link>
          <Link className="btn btn-brand px-4" href="/register">Get started</Link>
        </div>
      </nav>

      <section className="hero container-fluid px-4 px-lg-5">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">SMARTER WORK • LESS FRICTION</span>
            <h1>Turn scattered work into a <span className="hero-highlight">clear flow.</span></h1>
            <p className="hero-lead">
              A clean, modern task board for creating work, assigning ownership,
              and moving every task toward done.
            </p>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link className="btn btn-brand btn-lg px-4" href="/register">
                Create your workspace
              </Link>
              <Link className="btn btn-soft btn-lg px-4" href="/login">
                Explore dashboard
              </Link>
            </div>

            <div className="hero-metrics">
              <div><strong>3</strong><span>workflow stages</span></div>
              <div><strong>2</strong><span>user roles</span></div>
              <div><strong>1</strong><span>shared source of truth</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="ambient ambient-one" />
            <div className="ambient ambient-two" />
            <div className="board-window">
              <div className="window-bar">
                <div className="window-dots"><i/><i/><i/></div>
                <span className="window-title">My workspace</span>
                <span className="status-pill">LIVE</span>
              </div>
              <div className="mini-board">
                {[
                  ["TO DO", "2", ["Plan onboarding", "Fix login validation"]],
                  ["DOING", "2", ["Build API", "Polish dashboard"]],
                  ["DONE", "1", ["Setup database"]]
                ].map(([title, count, tasks]) => (
                  <div className="mini-column" key={title}>
                    <div className="mini-column-title">
                      <span>{title}</span><b>{count}</b>
                    </div>
                    {tasks.map((task, index) => (
                      <div className="mini-card" key={task}>
                        <span className={`mini-tag tag-${index % 3}`}>{index === 0 ? "NEW" : "WORK"}</span>
                        <strong>{task}</strong>
                        <div className="mini-card-foot">
                          <span className="avatar">{String.fromCharCode(65 + index)}</span>
                          <small>Today</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-strip container-fluid px-4 px-lg-5">
        <div className="row g-4">
          {features.map(([number, title, text]) => (
            <div className="col-md-4" key={number}>
              <div className="feature-card">
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
