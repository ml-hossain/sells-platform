# Firestore Security Rules Documentation

## Overview

This document explains the Firestore security rules implemented for the NextGen EduMigrate website. The rules enforce role-based access control, data validation, and proper security measures for all collections.

## Security Model

### User Roles
- **Admin**: Full access to all collections and operations
- **Public**: Limited read access and ability to submit forms
- **Authenticated Users**: Can manage their own user profile

### Authentication
- Firebase Authentication with Google sign-in
- Role-based access control using custom claims
- Middleware protection for admin routes

## Collections and Access Rules

### 1. `users` Collection
**Purpose**: Store user roles and permissions

**Access Rules**:
- **Read**: Users can read their own profile, admins can read all
- **Create**: Authenticated users can create their own profile
- **Update**: Users can update their own profile, admins can update any
- **Delete**: Only admins can delete user profiles

**Data Validation**:
- Required fields: `uid`, `email`, `role`, `createdAt`, `updatedAt`
- Email must be valid format
- Role must be either 'admin' or 'user'
- Timestamps must be valid and not in the future
- Optional `permissions` array

### 2. `universities` Collection
**Purpose**: Store university listings with publication status

**Access Rules**:
- **Read**: Public can read only published universities, admins can read all
- **Create/Update/Delete**: Only admins

**Data Validation**:
- Required fields: `name`, `country`, `type`, `image`, `shortDescription`, `details`, `status`, `createdAt`, `updatedAt`
- Name: 1-200 characters
- Country: 1-100 characters
- Type: Must be 'Public' or 'Private'
- Status: Must be 'draft' or 'published'
- Short description: 1-200 characters
- Details: Must not be empty
- Image: Must be non-empty string

### 3. `successStories` Collection
**Purpose**: Store student success stories and testimonials

**Access Rules**:
- **Read**: Public can read all success stories
- **Create/Update/Delete**: Only admins

**Data Validation**:
- Required fields: `name`, `country`, `university`, `program`, `story`, `image`, `rating`, `flag`, `color`, `createdAt`, `updatedAt`
- Name: 1-100 characters
- Country: 1-100 characters
- University: 1-200 characters
- Program: 1-200 characters
- Story: 1-5000 characters
- Rating: Number between 1-5
- Flag and color: Non-empty strings

### 4. `teamMembers` Collection
**Purpose**: Store team member profiles

**Access Rules**:
- **Read**: Public can read all team members
- **Create/Update/Delete**: Only admins

**Data Validation**:
- Required fields: `name`, `role`, `bio`, `image`, `order`, `createdAt`, `updatedAt`
- Name: 1-100 characters
- Role: 1-100 characters
- Bio: 1-1000 characters
- Order: Non-negative number
- Image: Non-empty string

### 5. `contactMessages` Collection
**Purpose**: Store contact form submissions

**Access Rules**:
- **Create**: Public can submit contact messages
- **Read/Update**: Only admins
- **Delete**: Only admins

**Data Validation**:
- Required fields: `firstName`, `lastName`, `email`, `subject`, `message`, `status`, `priority`, `createdAt`, `updatedAt`
- First/Last name: 1-50 characters
- Email: Valid email format
- Phone: Optional, valid phone format if provided
- Subject: 1-200 characters
- Message: 1-2000 characters
- Status: Must be 'new', 'read', 'replied', or 'closed'
- Priority: Must be 'low', 'medium', 'high', or 'urgent'
- Optional fields: `assignedTo`, `notes`, `repliedAt`

### 6. `consultations` Collection
**Purpose**: Store consultation request submissions

**Access Rules**:
- **Create**: Public can submit consultation requests
- **Read/Update**: Only admins
- **Delete**: Only admins

**Data Validation**:
- Required fields: `firstName`, `lastName`, `email`, `phone`, `agreeToTerms`, `subscribeNewsletter`, `status`, `priority`, `createdAt`, `updatedAt`
- First/Last name: 1-50 characters
- Email: Valid email format
- Phone: Valid phone format
- Optional fields: `preferredDestination`, `programLevel`, `message`
- `agreeToTerms`: Must be true
- `subscribeNewsletter`: Boolean
- Status: Must be 'pending', 'contacted', 'scheduled', 'completed', or 'cancelled'
- Priority: Must be 'low', 'medium', 'high', or 'urgent'
- Optional fields: `assignedTo`, `notes`, `scheduledDate`

### 7. `settings` Collection
**Purpose**: Store company settings and configuration

**Access Rules**:
- **Read/Write**: Only admins

**Data Validation**:
- Required fields: `companyName`, `mainOffice`, `contact`, `emails`, `businessHours`, `lastUpdated`
- Company name: 1-200 characters
- Main office: Map with required address fields
- Contact: Map with required phone fields
- Emails: Map with required email fields (valid email format)
- Business hours: Map with required time and timezone fields
- Optional fields: `tagline`, `description`, `regionalOffices`, `socialMedia`, `updatedBy`

## Helper Functions

### Authentication Functions
- `isAuthenticated()`: Checks if user is logged in
- `isAdmin()`: Checks if user has admin role
- `isOwner(userId)`: Checks if user owns the document

### Validation Functions
- `isValidEmail(email)`: Validates email format using regex
- `isValidPhone(phone)`: Validates phone format using regex
- `isValidTimestamp(timestamp)`: Validates timestamp is not in the future

## Security Features

### 1. Role-Based Access Control
- Admin users have full access to all collections
- Public users have limited read access and form submission capabilities
- Users can only manage their own profiles

### 2. Data Validation
- Comprehensive field validation for all collections
- Type checking and length restrictions
- Required field enforcement
- Format validation for emails and phone numbers

### 3. Content Status Filtering
- Universities are filtered by publication status
- Public users can only see published content
- Admins can see and manage all content

### 4. Input Sanitization
- String length limits prevent oversized data
- Enum validation for status and priority fields
- Timestamp validation prevents future dates

### 5. Deny by Default
- All unspecified access is denied
- Explicit permissions required for all operations

## Deployment

### Local Development
```bash
# Test rules locally
firebase emulators:start --only firestore

# Validate rules syntax
firebase firestore:rules:validate
```

### Production Deployment
```bash
# Deploy rules to production
firebase deploy --only firestore:rules
```

## Testing

### Test Cases to Verify
1. **Public Access**:
   - Can read published universities
   - Can read success stories and team members
   - Can submit contact forms and consultations
   - Cannot access admin-only collections

2. **Admin Access**:
   - Can perform all CRUD operations on all collections
   - Can read draft universities
   - Can manage user roles

3. **Data Validation**:
   - Invalid email formats are rejected
   - Oversized strings are rejected
   - Missing required fields are rejected
   - Invalid status values are rejected

4. **Security**:
   - Unauthenticated users cannot access protected data
   - Users cannot access other users' profiles
   - Public users cannot modify any data except form submissions

## Monitoring and Logging

### Firestore Security Rules Monitoring
- Enable Firestore security rules monitoring in Firebase Console
- Monitor failed requests and rule violations
- Set up alerts for suspicious activity

### Best Practices
1. Regularly review and update rules as the application evolves
2. Test rules thoroughly before deployment
3. Monitor rule performance and optimize as needed
4. Keep rules simple and maintainable
5. Document any rule changes

## Troubleshooting

### Common Issues
1. **Permission Denied**: Check user authentication and role
2. **Validation Errors**: Verify data format and required fields
3. **Performance Issues**: Optimize complex queries and rules

### Debugging
- Use Firebase Console to view rule evaluation logs
- Test rules in the Firebase Console Rules Playground
- Check client-side error messages for specific validation failures 