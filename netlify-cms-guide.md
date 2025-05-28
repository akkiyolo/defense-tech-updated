# Netlify CMS Integration for Defense Technology Website

This document provides instructions for setting up and using the Netlify CMS integration for your Defense Technology website.

## Setup Instructions

### 1. Deploy to Netlify

1. Create a Netlify account if you don't have one already at [netlify.com](https://www.netlify.com/)
2. From your Netlify dashboard, click "New site from Git"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select the repository where you've uploaded the website files
5. Configure build settings (not required for this static site)
6. Click "Deploy site"

### 2. Enable Netlify Identity

1. Once your site is deployed, go to the site settings in your Netlify dashboard
2. Navigate to "Identity" and click "Enable Identity"
3. Under Identity settings, configure the following:
   - Set Registration preferences to "Invite only"
   - Enable "Git Gateway" under "Services" (this connects your CMS to your Git repository)

### 3. Invite Admin Users

1. Go to the "Identity" tab in your Netlify dashboard
2. Click "Invite users" and enter the email addresses of your admin team
3. Each invited user will receive an email with a link to accept the invitation and set up their password

## Using the CMS

### Accessing the Admin Panel

1. Navigate to your website URL + "/admin/" (e.g., `https://your-site-name.netlify.app/admin/`)
2. Log in with your credentials
3. You'll be taken to the Netlify CMS dashboard where you can manage your content

### Creating a New Article

1. From the CMS dashboard, click on "Articles" in the left sidebar
2. Click the "New Article" button
3. Fill in the required fields:
   - Title: The article headline
   - Publication Date: When the article should be published
   - Featured Image: Upload a main image for the article
   - Category: Select from the dropdown (Land Systems, Naval Systems, Air Systems, Space & Cyber, Future Technologies)
   - Tags: Add relevant tags to help with filtering and organization
   - Summary: A brief description that appears in article listings
   - Body: The main content of your article (supports Markdown formatting)
   - Enable Comments: Toggle to allow or disable comments on this article
4. Click "Save" to save as a draft, or "Publish" to make the article live immediately

### Managing Existing Articles

1. From the CMS dashboard, click on "Articles" in the left sidebar
2. You'll see a list of all existing articles
3. Click on any article to edit its content
4. Use the status toggle to publish or unpublish articles

### Adding Images to Articles

1. When editing an article, place your cursor where you want to insert an image
2. Click the image button in the editor toolbar
3. Upload a new image or select from previously uploaded images
4. The image will be automatically optimized and stored in your repository

### Managing Categories and Tags

- Categories are predefined in the CMS configuration
- Tags can be freely added when creating or editing articles
- Use consistent tagging to help with organization and filtering

## Comments System

The website uses Disqus for comments. Comments are enabled by default for all articles but can be disabled on a per-article basis.

## Technical Details

- All content is stored as Markdown files in your Git repository
- Images are stored in the `/assets/images/uploads/` directory
- The CMS automatically handles Git commits when content is published
- Changes may take a few minutes to appear on your live site as Netlify rebuilds the site

## Troubleshooting

If you encounter any issues:

1. Check that Netlify Identity and Git Gateway are properly configured
2. Ensure your repository has the correct permissions set
3. Clear your browser cache and cookies
4. Check the browser console for any error messages

For additional help, refer to the [Netlify CMS documentation](https://www.netlifycms.org/docs/intro/).
