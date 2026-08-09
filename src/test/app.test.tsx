import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { PinInput } from '../components/student/PinInput';
import { storage } from '../utils/storage';
import { parseApiError } from '../utils/errors';

describe('CodeSphere AI App Components & Utilities', () => {

  beforeEach(() => {
    storage.clearSession();
  });

  it('renders HomePage title and subtitle correctly', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getAllByText('CodeSphere AI')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Intelligent Real-Time Coding Classroom')[0]).toBeInTheDocument();
    expect(screen.getByText('Teacher Portal')).toBeInTheDocument();
    expect(screen.getByText('Student Portal')).toBeInTheDocument();
  });

  it('renders 6-digit PinInput component', () => {
    render(<PinInput value="483921" onChange={() => {}} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
    expect(inputs[0]).toHaveValue('4');
    expect(inputs[5]).toHaveValue('1');
  });

  it('manages sessionStorage tokens safely', () => {
    storage.setTeacherToken('test_teacher_token_123');
    storage.setStudentToken('test_student_token_456');
    storage.setSessionId(42);

    expect(storage.getTeacherToken()).toBe('test_teacher_token_123');
    expect(storage.getStudentToken()).toBe('test_student_token_456');
    expect(storage.getSessionId()).toBe(42);

    storage.clearSession();
    expect(storage.getTeacherToken()).toBeNull();
    expect(storage.getStudentToken()).toBeNull();
    expect(storage.getSessionId()).toBeNull();
  });

  it('parses API error codes to user-friendly messages', () => {
    const errorObj = {
      response: {
        data: {
          error: {
            code: 'DUPLICATE_ROLL_NUMBER',
            message: 'A student with this Roll Number has already joined this session.',
          },
        },
      },
    };

    const parsed = parseApiError(errorObj);
    expect(parsed).toBe('A student with this Roll Number has already joined this session.');
  });
});
