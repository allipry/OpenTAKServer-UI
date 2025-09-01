import { describe, it, expect } from 'vitest';
import { render } from '../../../test-utils';
import { ItakQRModal } from '../ItakQRModal';

describe('ItakQRModal', () => {
  it('renders without crashing', () => {
    const mockOnClose = () => {};
    
    expect(() => {
      render(
        <ItakQRModal opened={false} onClose={mockOnClose} />
      );
    }).not.toThrow();
  });

  it('renders with opened state', () => {
    const mockOnClose = () => {};
    
    expect(() => {
      render(
        <ItakQRModal opened={true} onClose={mockOnClose} />
      );
    }).not.toThrow();
  });
});