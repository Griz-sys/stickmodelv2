# ✅ Quick Test Guide

## Prerequisites

Ensure you have:

- ✅ Database migrated: `npx prisma migrate dev`
- ✅ Database seeded: `npm run db:seed`
- ✅ Vercel Blob token in `.env`
- ✅ Dev server running: `npm run dev`

## 🧪 Test Workflow (5 Minutes)

### Step 1: Test User Project Creation (2 min)

1. **Login as User**
   - Go to http://localhost:3000/login
   - Email: `user@stickmodel.com`
   - Password: `user123`

2. **Create Project**
   - Navigate to `/home`
   - Drag & drop any PDF file (or click to browse)
   - Fill form:
     - Project Name: "Test Building Alpha"
     - Enable "Include Bill of Materials"
     - Notes: "Please prioritize the foundation sections"
     - Check both confirmation boxes
   - Click "Create Project"

3. **Verify**
   - ✅ Redirects to project detail page
   - ✅ Status shows "Uploaded"
   - ✅ Your file appears under "Your Uploaded Files"
   - ✅ Can download the file you just uploaded

### Step 2: Test Admin Management (2 min)

1. **Logout & Login as Admin**
   - Click logout
   - Login with:
     - Email: `admin@stickmodel.com`
     - Password: `admin123`

2. **Find User's Project**
   - Go to `/admin`
   - Look for "Test Building Alpha"
   - Click to open modal

3. **Update Status**
   - Click "In Progress" button
   - Verify status badge updates

4. **Upload Final File**
   - Click "Upload File"
   - Select any file
   - Description: "Final calculations and model"
   - Click "Upload"
   - Wait for success message

5. **(Optional) Upload Video**
   - Click "Upload Video"
   - Select any video file (.mp4, .mov, etc.)
   - Click "Upload Video"
   - Verify video link appears

6. **Mark as Finished**
   - Click "Finished" button
   - Close modal

### Step 3: Test User Download (1 min)

1. **Logout & Login as User Again**
   - Logout from admin
   - Login as `user@stickmodel.com`

2. **View Finished Project**
   - Go to `/home`
   - Click "Test Building Alpha"
   - Verify:
     - ✅ Status shows "Finished"
     - ✅ Green success message appears
     - ✅ "Final Deliverables" section shows admin's file
     - ✅ Video link appears (if uploaded)
     - ✅ Payment section is visible (but non-functional)

3. **Download Files**
   - Click download on admin's file
   - Verify file downloads successfully

## Expected Results

### After User Creation:

- New project in database
- File uploaded to Vercel Blob
- Submission record created
- Project appears in user's home page

### After Admin Upload:

- Admin file in Vercel Blob
- New submission with `uploadedBy: "admin"`
- File visible to user

### After Status Changes:

- User sees real-time status updates
- Status badge color changes:
  - Blue = Uploaded
  - Orange = In Progress
  - Green = Finished

## 🔍 Verify Database

```bash
# Open Prisma Studio
npx prisma studio

# Check:
# 1. Projects table has your "Test Building Alpha"
# 2. Submissions table has 2+ records (user upload + admin upload)
# 3. Project.status = "finished"
# 4. Project.videoUrl has blob URL (if uploaded)
```

## 🚨 Common Issues

### Upload Fails

**Problem:** "Failed to create project"
**Solution:** Check console for errors. Ensure BLOB_READ_WRITE_TOKEN is set.

### Can't See Project

**Problem:** Project not appearing after creation
**Solution:** Refresh page. Check database has record.

### Download Fails

**Problem:** "Failed to download file"
**Solution:** Ensure submission has `s3Url` field populated.

### Status Not Updating

**Problem:** Status stays "Uploaded"
**Solution:** Admin must click status buttons. Check API response.

## ✅ Success Criteria

All of these should work:

- [x] User can create project
- [x] File uploads to Vercel Blob
- [x] Project appears in user's list
- [x] Admin can see all projects
- [x] Admin can update status
- [x] Admin can upload files
- [x] Admin can upload video (optional)
- [x] User can see status changes
- [x] User can download admin files
- [x] User can view video link
- [x] Payment button appears (but doesn't work)

## 🎯 What's Working

### ✅ Complete Features:

- User authentication (JWT)
- Project creation
- File upload (Vercel Blob)
- Admin dashboard
- Status management
- Two-way file exchange
- Video upload
- Real-time updates
- Role-based access control

### ⏸️ Stub Features (Not Implemented):

- Payment processing (button exists, shows message)
- Email notifications
- Real-time websockets

## Next Steps

If all tests pass:

1. ✅ Basic workflow is complete
2. ⏭️ Ready for production deployment
3. ⏭️ Can add payment integration
4. ⏭️ Can add email notifications

If tests fail:

1. Check [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) for troubleshooting
2. Verify environment variables
3. Check database migrations
4. Review API logs in console

---

**Happy Testing! 🚀**
