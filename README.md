# MediQ Frontend - New Backend Endpoints Required

This document outlines all the new backend endpoints that need to be implemented to support the complete MediQ frontend functionality.

## Overview

The frontend has been updated to integrate with real backend APIs. The following endpoints are required to make all features fully functional.

## New Endpoints Required

### Patient Endpoints

#### GET /patient/queue_status
**Purpose**: Get patient's current queue position and status
**Method**: GET
**Request Body**: None
**Response Body**:
```json
{
  "position": 3,
  "totalInQueue": 12,
  "estimatedWait": 45,
  "doctorName": "Dr. Sarah Johnson",
  "specialty": "Cardiology",
  "roomNumber": 205,
  "joinTime": "10:30 AM",
  "status": "waiting",
  "hospitalName": "City General Hospital"
}
```

### Doctor Endpoints

#### GET /doctor/queue
**Purpose**: Get doctor's patient queue
**Method**: GET
**Request Body**: None
**Response Body**:
```json
{
  "patients": [
    {
      "patient_id": "123",
      "name": "John Doe",
      "age": 45,
      "appointment_time": "2:00 PM",
      "reason": "Follow-up consultation",
      "status": "waiting",
      "wait_time": 15,
      "phone": "+1 (555) 123-4567"
    }
  ],
  "currentPatient": "123",
  "totalInQueue": 5
}
```

#### GET /doctor/available_slots
**Purpose**: Get doctor's available time slots for a specific date
**Method**: GET
**Query Parameters**:
- `doctor_id`: string (required)
- `date`: string (required, format: YYYY-MM-DD)
**Response Body**:
```json
[
  {
    "slot_id": "slot_123",
    "start_time": "09:00",
    "end_time": "09:30",
    "is_available": true,
    "date": "2024-01-15",
    "doctor_name": "Dr. Sarah Smith",
    "hospital_name": "City General Hospital"
  }
]
```

#### GET /doctor/availability
**Purpose**: Get doctor's availability schedule
**Method**: GET
**Request Body**: None
**Response Body**:
```json
[
  {
    "slot_id": "slot_123",
    "hospital_id": "hosp_1",
    "start_time": "2024-01-15 09:00:00",
    "end_time": "2024-01-15 09:30:00",
    "is_available": true,
    "slot_type": "consult",
    "date": "2024-01-15",
    "doctor_name": "Dr. Sarah Smith",
    "hospital_name": "City General Hospital"
  }
]
```

### Nurse Endpoints

#### GET /nurse/queue
**Purpose**: Get nurse's view of patient queue
**Method**: GET
**Request Body**: None
**Response Body**:
```json
{
  "patients": [
    {
      "patient_id": "123",
      "name": "John Doe",
      "age": 45,
      "appointment_time": "2:00 PM",
      "reason": "Follow-up consultation",
      "status": "waiting",
      "wait_time": 15,
      "phone": "+1 (555) 123-4567"
    }
  ],
  "totalInQueue": 5
}
```

#### GET /nurse/rooms
**Purpose**: Get room status and availability
**Method**: GET
**Request Body**: None
**Response Body**:
```json
[
  {
    "room_id": "room_201",
    "room_number": "201",
    "status": "available",
    "patient_id": null,
    "patient_name": null,
    "department": "General Medicine",
    "floor": 2
  }
]
```

#### PUT /nurse/update_patient_status
**Purpose**: Update patient status in queue
**Method**: PUT
**Request Body**:
```json
{
  "patient_id": "123",
  "status": "in_progress"
}
```
**Response Body**:
```json
{
  "message": "Patient status updated",
  "patient_id": "123",
  "status": "in_progress"
}
```

#### PUT /nurse/assign_room
**Purpose**: Assign room to patient
**Method**: PUT
**Request Body**:
```json
{
  "patient_id": "123",
  "room_id": "room_201"
}
```
**Response Body**:
```json
{
  "message": "Room assigned successfully",
  "patient_id": "123",
  "room_id": "room_201"
}
```

### Hospital Endpoints

#### GET /hospital/get_hospitals
**Purpose**: List all hospitals with basic information
**Method**: GET
**Request Body**: None
**Response Body**:
```json
[
  {
    "hospital_id": "hosp_1",
    "name": "City General Hospital",
    "location": "123 Main St, City",
    "departments": ["General Medicine", "Cardiology", "Emergency"],
    "congestion": 0.75
  }
]
```

### Admin Endpoints

#### GET /admin/users
**Purpose**: Get all users with pagination
**Method**: GET
**Query Parameters**:
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)
**Response Body**:
```json
{
  "users": [
    {
      "user_id": "user_123",
      "name": "Dr. Sarah Smith",
      "email": "sarah@hospital.com",
      "role": "doctor",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

#### POST /admin/users
**Purpose**: Create new user (any role)
**Method**: POST
**Request Body**:
```json
{
  "name": "Dr. John Doe",
  "email": "john@hospital.com",
  "password": "securepassword",
  "role": "doctor"
}
```
**Response Body**:
```json
{
  "message": "User created successfully",
  "user_id": "user_456"
}
```

#### DELETE /admin/users/{id}
**Purpose**: Delete user
**Method**: DELETE
**Request Body**: None
**Response Body**:
```json
{
  "message": "User deleted successfully",
  "user_id": "user_456"
}
```

## Additional Endpoints for Enhanced Functionality

### Room Management Endpoints

#### PUT /nurse/release_room
**Purpose**: Release room from patient
**Method**: PUT
**Request Body**:
```json
{
  "room_id": "room_201"
}
```

#### PUT /nurse/clean_room
**Purpose**: Mark room as cleaned
**Method**: PUT
**Request Body**:
```json
{
  "room_id": "room_201"
}
```

## Implementation Notes

1. **Authentication**: All endpoints should require proper authentication (JWT token in Authorization header)

2. **Error Handling**: All endpoints should return consistent error responses:
   ```json
   {
     "error": "Error message",
     "message": "Detailed error description"
   }
   ```

3. **Status Codes**: Use appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500)

4. **Data Validation**: Implement proper input validation for all request bodies

5. **Rate Limiting**: Consider implementing rate limiting for API endpoints

6. **Logging**: Log all API calls for debugging and monitoring

## Testing

Once these endpoints are implemented, the frontend will be able to:
- ✅ Register users with different roles
- ✅ Book appointments with real hospital/doctor data
- ✅ Display real-time queue status for patients
- ✅ Manage doctor availability and time slots
- ✅ Handle nurse queue management and room assignments
- ✅ Show real analytics data for admins
- ✅ Perform CRUD operations on users

## Priority Order

1. **High Priority**: Patient queue status, doctor queue, appointment booking
2. **Medium Priority**: Nurse queue management, room status
3. **Low Priority**: Admin user management, advanced analytics

This implementation will make the MediQ frontend fully functional with real backend integration.
