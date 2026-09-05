/** 사람 한 명의 자리. 아직 안 채웠으면 전부 빈 문자열이다. */
export interface EditableSlot {
  memberId: string;
  author: string;
  title: string;
  url: string;
  tags: string;
}

/** 폼이 그리는 데 필요한 회차 한 벌. 서버에서 미리 만들어 넘긴다. */
export interface EditableArchive {
  id: number;
  title: string;
  date: string;
  type: 'on-line' | 'off-line';
  /** 멤버 명부 순서대로. */
  slots: EditableSlot[];
}
