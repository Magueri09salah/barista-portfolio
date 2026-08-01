"use client";

import { useState, type FormEvent } from "react";
import { enquiryTypes, profile } from "@/lib/content";
import { photo } from "@/lib/photos";
import { Badge, Button, Icon, Photo, SectionHead } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import s from "./sections.module.css";

export function Contact() {
  const [note, setNote] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    if (!name) {
      setNote("Add your name so I know who I am writing back to.");
      form.querySelector<HTMLInputElement>("#f-name")?.focus();
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setNote("That email address will not reach you. Check it and try again.");
      form.querySelector<HTMLInputElement>("#f-email")?.focus();
      return;
    }

    // Wire this to a real endpoint — see README.
    setNote(`Thank you. Until this form is connected, email me directly at ${profile.email}.`);
    form.reset();
  }

  return (
    <section className="section bgInverse" id="contact">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="Contact"
            title="Looking for a barista who shows up early."
            titleClass="d3"
          />
        </Reveal>

        <div className={s.contactGrid}>
          <div>
            <Reveal className={s.contactPhoto}>
              <Photo
                tone="gold"
                label="Bar, end of service"
                sizes="(max-width: 900px) 100vw, 45vw"
                {...photo("contact")}
              />
            </Reveal>

            <dl className={s.contactMeta}>
              <div>
                <dt>Based in</dt>
                <dd>
                  {profile.city}, {profile.country}
                </dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>
                  <Badge variant="success" dot>
                    {profile.availability}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${profile.phoneHref}`}>{profile.phone}</a>
                </dd>
              </div>
              <div>
                <dt>LinkedIn</dt>
                <dd>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer">
                    {profile.linkedinLabel}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>Arabic · English · French</dd>
              </div>
            </dl>

            <div className={s.socials}>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" size={20} />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <Icon name="mail" size={20} />
              </a>
            </div>
          </div>

          <form className={s.form} onSubmit={onSubmit} noValidate>
            <div className={s.field}>
              <label htmlFor="f-name">Your name</label>
              <input id="f-name" name="name" type="text" placeholder="Your name" />
            </div>
            <div className={s.field}>
              <label htmlFor="f-email">Email</label>
              <input id="f-email" name="email" type="email" placeholder="you@venue.com" />
            </div>
            <div className={s.field}>
              <label htmlFor="f-type">What do you need?</label>
              <select id="f-type" name="type">
                {enquiryTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className={s.field}>
              <label htmlFor="f-when">Venue and location</label>
              <input id="f-when" name="venue" type="text" placeholder="Café name, city" />
            </div>
            <div className={s.field}>
              <label htmlFor="f-msg">Tell me about it</label>
              <textarea
                id="f-msg"
                name="message"
                placeholder="The role, the hours, the machine you run, and when you need someone."
              />
            </div>

            <Button type="submit" variant="gold" style={{ alignSelf: "flex-start" }}>
              Send enquiry
              <Icon name="arrowRight" size={20} />
            </Button>

            <p className={`cap ${s.formNote}`} role="status">
              {note}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
