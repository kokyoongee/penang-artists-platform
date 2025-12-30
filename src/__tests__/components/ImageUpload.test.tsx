import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageUpload } from '@/components/admin/ImageUpload';

describe('ImageUpload Component', () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    value: '',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockReset();
  });

  describe('Rendering', () => {
    it('should render upload button when no value', () => {
      render(<ImageUpload {...defaultProps} />);

      expect(screen.getByText('Upload an image')).toBeInTheDocument();
      expect(screen.getByText('Max 5MB')).toBeInTheDocument();
    });

    it('should render custom placeholder text', () => {
      render(<ImageUpload {...defaultProps} placeholder="Upload profile photo" />);

      expect(screen.getByText('Upload profile photo')).toBeInTheDocument();
    });

    it('should render image preview when value is provided', () => {
      render(<ImageUpload {...defaultProps} value="https://example.com/image.jpg" />);

      const image = screen.getByAltText('Uploaded image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', expect.stringContaining('example.com'));
    });

    it('should render remove button when image is displayed', () => {
      render(<ImageUpload {...defaultProps} value="https://example.com/image.jpg" />);

      const removeButton = screen.getByRole('button');
      expect(removeButton).toBeInTheDocument();
    });

    it('should render URL input fallback', () => {
      render(<ImageUpload {...defaultProps} />);

      expect(screen.getByPlaceholderText('https://...')).toBeInTheDocument();
      expect(screen.getByText('or paste URL:')).toBeInTheDocument();
    });
  });

  describe('Aspect Ratio', () => {
    it('should apply square aspect ratio by default', () => {
      const { container } = render(<ImageUpload {...defaultProps} />);

      const button = container.querySelector('button');
      expect(button?.className).toContain('aspect-square');
    });

    it('should apply landscape aspect ratio when specified', () => {
      const { container } = render(<ImageUpload {...defaultProps} aspectRatio="landscape" />);

      const button = container.querySelector('button');
      expect(button?.className).toContain('aspect-[4/3]');
    });

    it('should apply portrait aspect ratio when specified', () => {
      const { container } = render(<ImageUpload {...defaultProps} aspectRatio="portrait" />);

      const button = container.querySelector('button');
      expect(button?.className).toContain('aspect-[3/4]');
    });

    it('should apply banner aspect ratio when specified', () => {
      const { container } = render(<ImageUpload {...defaultProps} aspectRatio="banner" />);

      const button = container.querySelector('button');
      expect(button?.className).toContain('aspect-[16/9]');
    });
  });

  describe('File Selection', () => {
    it('should trigger file input click when upload button is clicked', () => {
      render(<ImageUpload {...defaultProps} />);

      const uploadButton = screen.getByRole('button', { name: /upload/i });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const clickSpy = vi.spyOn(fileInput, 'click');
      fireEvent.click(uploadButton);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should accept only image files', () => {
      render(<ImageUpload {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('accept', 'image/*');
    });
  });

  describe('File Upload', () => {
    it('should show uploading state during upload', async () => {
      (global.fetch as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ url: 'https://example.com/uploaded.jpg' }),
                }),
              100
            );
          })
      );

      render(<ImageUpload {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('Uploading...')).toBeInTheDocument();
      });
    });

    it('should call onChange with uploaded URL on success', async () => {
      const uploadedUrl = 'https://supabase.co/storage/images/test.jpg';
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ url: uploadedUrl }),
      });

      render(<ImageUpload {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(uploadedUrl);
      });
    });

    it('should send correct FormData to API', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ url: 'https://example.com/test.jpg' }),
      });

      render(<ImageUpload {...defaultProps} bucket="images" folder="profiles" />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/upload', {
          method: 'POST',
          body: expect.any(FormData),
        });
      });

      // Check FormData contents
      const fetchCall = (global.fetch as any).mock.calls[0];
      const formData = fetchCall[1].body as FormData;
      expect(formData.get('bucket')).toBe('images');
      expect(formData.get('folder')).toBe('profiles');
      expect(formData.get('file')).toBeInstanceOf(File);
    });
  });

  describe('Validation', () => {
    it('should show error for non-image files', async () => {
      render(<ImageUpload {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('Please upload an image file')).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should show error for files larger than 5MB', async () => {
      render(<ImageUpload {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const largeContent = new Uint8Array(6 * 1024 * 1024);
      const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('Image must be less than 5MB')).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should show error message when upload fails', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: { message: 'Upload failed' } }),
      });

      render(<ImageUpload {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('Upload failed')).toBeInTheDocument();
      });
    });

    it('should show generic error when fetch throws', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      render(<ImageUpload {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });

  describe('Remove Image', () => {
    it('should call onChange with empty string when remove is clicked', () => {
      render(<ImageUpload {...defaultProps} value="https://example.com/image.jpg" />);

      const removeButton = screen.getByRole('button');
      fireEvent.click(removeButton);

      expect(mockOnChange).toHaveBeenCalledWith('');
    });
  });

  describe('URL Input Fallback', () => {
    it('should call onChange when URL is entered directly', () => {
      render(<ImageUpload {...defaultProps} />);

      const urlInput = screen.getByPlaceholderText('https://...');
      fireEvent.change(urlInput, { target: { value: 'https://example.com/direct.jpg' } });

      expect(mockOnChange).toHaveBeenCalledWith('https://example.com/direct.jpg');
    });

    it('should show current value in URL input', () => {
      render(<ImageUpload {...defaultProps} value="https://example.com/current.jpg" />);

      const urlInput = screen.getByPlaceholderText('https://...');
      expect(urlInput).toHaveValue('https://example.com/current.jpg');
    });
  });

  describe('Disabled State', () => {
    it('should disable upload button while uploading', async () => {
      (global.fetch as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ url: 'https://example.com/test.jpg' }),
                }),
              100
            );
          })
      );

      render(<ImageUpload {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', { name: /uploading/i });
        expect(uploadButton).toBeDisabled();
      });
    });
  });
});
