export const formatName = name => name.toLowerCase().replace(/[\s-]+/g, '_');

export const toggleSpinner = (show, spinner) =>
  (spinner.style.display = show ? 'block' : 'none');

export const getJSON = async function (url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': 'o2UXq8pWVEg5rGLbiYeGzw==9XIV2HjOrjRzadc5',
      },
    });

    if (!res.ok)
      throw new Error('Oops! Something went wrong. Please try again later.');

    return res.json();
  } catch (err) {
    // Handle network errors separately (e.g., lost internet connection)
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      throw new Error(
        'Network error! Please check your internet connection...'
      );
    }
    throw err;
  }
};
