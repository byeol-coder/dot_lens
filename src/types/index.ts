export type MemberStatus = 'active' | 'new' | 'resting' | 'left';
export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused' | 'trial';
export type SessionLocation = '동작구 노들구장' | '신사 풋살장' | '광명 풋살장' | '기타' | '대회' | '연습';

export interface Member {
  id: string;
  name: string;
  nickname: string;
  jerseyNumber: string;
  position: string;
  profileImage: string;
  phone: string;
  joinDate: string;
  status: MemberStatus;
  memo: string;
  firstAttendanceDate?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  date: string;
  location: SessionLocation;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
}
