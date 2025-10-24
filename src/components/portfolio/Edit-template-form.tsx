"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface EditTemplateFormProps {
  templateId: string;
  templateTitle: string;
  editFields: string[];
}

const fieldComponents = {
  bio: () => (
    <Card>
      <CardHeader>
        <CardTitle>Personal Bio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="Enter your full name" />
        </div>
        <div>
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            placeholder="e.g., Senior Writer, Creative Director"
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Tell your story..." rows={4} />
        </div>
        <div>
          <Label htmlFor="profileImage">Profile Image URL</Label>
          <Input id="profileImage" placeholder="https://..." />
        </div>
      </CardContent>
    </Card>
  ),

  "writing-samples": () => (
    <Card>
      <CardHeader>
        <CardTitle>Writing Samples</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="sample1Title">Sample 1 Title</Label>
          <Input id="sample1Title" placeholder="Article or piece title" />
        </div>
        <div>
          <Label htmlFor="sample1Link">Sample 1 Link</Label>
          <Input id="sample1Link" placeholder="https://..." />
        </div>
        <div>
          <Label htmlFor="sample1Description">Sample 1 Description</Label>
          <Textarea
            id="sample1Description"
            placeholder="Brief description..."
            rows={2}
          />
        </div>
        <Separator />
        <div>
          <Label htmlFor="sample2Title">Sample 2 Title</Label>
          <Input id="sample2Title" placeholder="Article or piece title" />
        </div>
        <div>
          <Label htmlFor="sample2Link">Sample 2 Link</Label>
          <Input id="sample2Link" placeholder="https://..." />
        </div>
      </CardContent>
    </Card>
  ),

  "video-gallery": () => (
    <Card>
      <CardHeader>
        <CardTitle>Video Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="video1Title">Video 1 Title</Label>
          <Input id="video1Title" placeholder="Video title" />
        </div>
        <div>
          <Label htmlFor="video1Url">Video 1 URL</Label>
          <Input id="video1Url" placeholder="YouTube, Vimeo, or direct link" />
        </div>
        <div>
          <Label htmlFor="video1Thumbnail">Video 1 Thumbnail</Label>
          <Input id="video1Thumbnail" placeholder="Thumbnail image URL" />
        </div>
        <Separator />
        <div>
          <Label htmlFor="showreel">Showreel URL</Label>
          <Input id="showreel" placeholder="Your main showreel link" />
        </div>
      </CardContent>
    </Card>
  ),

  skills: () => (
    <Card>
      <CardHeader>
        <CardTitle>Technical Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="programmingLanguages">Programming Languages</Label>
          <Input
            id="programmingLanguages"
            placeholder="JavaScript, Python, TypeScript..."
          />
        </div>
        <div>
          <Label htmlFor="frameworks">Frameworks & Libraries</Label>
          <Input id="frameworks" placeholder="React, Next.js, Node.js..." />
        </div>
        <div>
          <Label htmlFor="tools">Tools & Technologies</Label>
          <Input id="tools" placeholder="Git, Docker, AWS..." />
        </div>
      </CardContent>
    </Card>
  ),

  projects: () => (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="project1Name">Project 1 Name</Label>
          <Input id="project1Name" placeholder="Project name" />
        </div>
        <div>
          <Label htmlFor="project1Description">Project 1 Description</Label>
          <Textarea
            id="project1Description"
            placeholder="What did you build?"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="project1Tech">Technologies Used</Label>
          <Input id="project1Tech" placeholder="React, Node.js, MongoDB..." />
        </div>
        <div>
          <Label htmlFor="project1Link">Live Demo Link</Label>
          <Input id="project1Link" placeholder="https://..." />
        </div>
        <div>
          <Label htmlFor="project1Github">GitHub Repository</Label>
          <Input id="project1Github" placeholder="https://github.com/..." />
        </div>
      </CardContent>
    </Card>
  ),

  "photo-gallery": () => (
    <Card>
      <CardHeader>
        <CardTitle>Photo Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="gallery1Title">Gallery 1 Title</Label>
          <Input id="gallery1Title" placeholder="e.g., Wedding Photography" />
        </div>
        <div>
          <Label htmlFor="gallery1Images">
            Gallery 1 Images (comma-separated URLs)
          </Label>
          <Textarea
            id="gallery1Images"
            placeholder="https://image1.jpg, https://image2.jpg..."
            rows={3}
          />
        </div>
        <Separator />
        <div>
          <Label htmlFor="featuredImage">Featured Image</Label>
          <Input id="featuredImage" placeholder="Your best shot URL" />
        </div>
      </CardContent>
    </Card>
  ),

  services: () => (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="service1">Service 1</Label>
          <Input id="service1" placeholder="e.g., Brand Photography" />
        </div>
        <div>
          <Label htmlFor="service1Price">Service 1 Starting Price</Label>
          <Input id="service1Price" placeholder="$500" />
        </div>
        <div>
          <Label htmlFor="service2">Service 2</Label>
          <Input id="service2" placeholder="e.g., Event Coverage" />
        </div>
        <div>
          <Label htmlFor="service2Price">Service 2 Starting Price</Label>
          <Input id="service2Price" placeholder="$800" />
        </div>
      </CardContent>
    </Card>
  ),

  contact: () => (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="your@email.com" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="+1 (555) 123-4567" />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="City, Country" />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" placeholder="https://yourwebsite.com" />
        </div>
      </CardContent>
    </Card>
  ),

  "social-media": () => (
    <Card>
      <CardHeader>
        <CardTitle>Social Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" placeholder="@yourusername" />
        </div>
        <div>
          <Label htmlFor="twitter">Twitter/X</Label>
          <Input id="twitter" placeholder="@yourusername" />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" placeholder="https://linkedin.com/in/..." />
        </div>
        <div>
          <Label htmlFor="behance">Behance</Label>
          <Input id="behance" placeholder="https://behance.net/..." />
        </div>
      </CardContent>
    </Card>
  ),

  github: () => (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="githubUsername">GitHub Username</Label>
          <Input id="githubUsername" placeholder="yourusername" />
        </div>
        <div>
          <Label htmlFor="pinnedRepos">
            Pinned Repositories (comma-separated)
          </Label>
          <Input id="pinnedRepos" placeholder="repo1, repo2, repo3" />
        </div>
      </CardContent>
    </Card>
  ),

  publications: () => (
    <Card>
      <CardHeader>
        <CardTitle>Publications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="publication1">Publication 1</Label>
          <Input id="publication1" placeholder="Publication name" />
        </div>
        <div>
          <Label htmlFor="publication1Link">Publication 1 Link</Label>
          <Input id="publication1Link" placeholder="https://..." />
        </div>
      </CardContent>
    </Card>
  ),

  testimonials: () => (
    <Card>
      <CardHeader>
        <CardTitle>Client Testimonials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="testimonial1">Testimonial 1</Label>
          <Textarea
            id="testimonial1"
            placeholder="Client feedback..."
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="testimonial1Author">Client 1 Name</Label>
          <Input id="testimonial1Author" placeholder="Client name" />
        </div>
        <div>
          <Label htmlFor="testimonial1Company">Client 1 Company</Label>
          <Input id="testimonial1Company" placeholder="Company name" />
        </div>
      </CardContent>
    </Card>
  ),

  equipment: () => (
    <Card>
      <CardHeader>
        <CardTitle>Equipment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cameras">Cameras</Label>
          <Input id="cameras" placeholder="Canon EOS R5, Sony A7III..." />
        </div>
        <div>
          <Label htmlFor="lenses">Lenses</Label>
          <Input id="lenses" placeholder="24-70mm f/2.8, 85mm f/1.4..." />
        </div>
        <div>
          <Label htmlFor="software">Software</Label>
          <Input id="software" placeholder="Final Cut Pro, Adobe Premiere..." />
        </div>
      </CardContent>
    </Card>
  ),

  packages: () => (
    <Card>
      <CardHeader>
        <CardTitle>Service Packages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="basicPackage">Basic Package</Label>
          <Input id="basicPackage" placeholder="Package name" />
        </div>
        <div>
          <Label htmlFor="basicPrice">Basic Package Price</Label>
          <Input id="basicPrice" placeholder="$299" />
        </div>
        <div>
          <Label htmlFor="basicFeatures">Basic Package Features</Label>
          <Textarea
            id="basicFeatures"
            placeholder="List features..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  ),

  "case-studies": () => (
    <Card>
      <CardHeader>
        <CardTitle>Case Studies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="case1Title">Case Study 1 Title</Label>
          <Input id="case1Title" placeholder="Project title" />
        </div>
        <div>
          <Label htmlFor="case1Challenge">Challenge</Label>
          <Textarea
            id="case1Challenge"
            placeholder="What was the challenge?"
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="case1Solution">Solution</Label>
          <Textarea
            id="case1Solution"
            placeholder="How did you solve it?"
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="case1Results">Results</Label>
          <Textarea
            id="case1Results"
            placeholder="What were the outcomes?"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  ),

  tools: () => (
    <Card>
      <CardHeader>
        <CardTitle>Tools & Software</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="designTools">Design Tools</Label>
          <Input
            id="designTools"
            placeholder="Figma, Adobe Creative Suite..."
          />
        </div>
        <div>
          <Label htmlFor="analyticsTools">Analytics Tools</Label>
          <Input
            id="analyticsTools"
            placeholder="Google Analytics, Hootsuite..."
          />
        </div>
        <div>
          <Label htmlFor="managementTools">Project Management</Label>
          <Input id="managementTools" placeholder="Trello, Asana, Notion..." />
        </div>
      </CardContent>
    </Card>
  ),

  experience: () => (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="job1Title">Job 1 Title</Label>
          <Input id="job1Title" placeholder="Senior Developer" />
        </div>
        <div>
          <Label htmlFor="job1Company">Company</Label>
          <Input id="job1Company" placeholder="Company name" />
        </div>
        <div>
          <Label htmlFor="job1Duration">Duration</Label>
          <Input id="job1Duration" placeholder="Jan 2020 - Present" />
        </div>
        <div>
          <Label htmlFor="job1Description">Description</Label>
          <Textarea
            id="job1Description"
            placeholder="Key responsibilities and achievements..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  ),

  education: () => (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="degree">Degree</Label>
          <Input id="degree" placeholder="Bachelor of Computer Science" />
        </div>
        <div>
          <Label htmlFor="school">School/University</Label>
          <Input id="school" placeholder="University name" />
        </div>
        <div>
          <Label htmlFor="graduationYear">Graduation Year</Label>
          <Input id="graduationYear" placeholder="2020" />
        </div>
      </CardContent>
    </Card>
  ),

  portfolio: () => (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="portfolio1Title">Portfolio Item 1</Label>
          <Input id="portfolio1Title" placeholder="Project name" />
        </div>
        <div>
          <Label htmlFor="portfolio1Image">Item 1 Image</Label>
          <Input id="portfolio1Image" placeholder="Image URL" />
        </div>
        <div>
          <Label htmlFor="portfolio1Description">Item 1 Description</Label>
          <Textarea
            id="portfolio1Description"
            placeholder="Brief description..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  ),

  process: () => (
    <Card>
      <CardHeader>
        <CardTitle>Work Process</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="step1">Step 1</Label>
          <Input id="step1" placeholder="Discovery & Research" />
        </div>
        <div>
          <Label htmlFor="step1Description">Step 1 Description</Label>
          <Textarea
            id="step1Description"
            placeholder="What happens in this step..."
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="step2">Step 2</Label>
          <Input id="step2" placeholder="Design & Concept" />
        </div>
        <div>
          <Label htmlFor="step2Description">Step 2 Description</Label>
          <Textarea
            id="step2Description"
            placeholder="What happens in this step..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  ),
};

export default function EditTemplateForm(
  { templateId, templateTitle, editFields }: EditTemplateFormProps // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  const [formData, setFormData] = useState({}); // eslint-disable-line @typescript-eslint/no-unused-vars

  const handleSave = () => {
    // Handle form submission
    console.log("Saving template data:", formData);
    // You would typically send this to your backend API
  };

  return (
    <div className="space-y-6">
      {editFields.map((field) => {
        const FieldComponent =
          fieldComponents[field as keyof typeof fieldComponents];
        return FieldComponent ? (
          <div key={field}>{FieldComponent()}</div>
        ) : null;
      })}

      <div className="flex gap-4 pt-6">
        <Button onClick={handleSave} size="lg">
          Save Changes
        </Button>
        <Button variant="outline" size="lg">
          Preview Portfolio
        </Button>
      </div>
    </div>
  );
}
