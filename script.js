document.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
  });
  
  let universitiesData = [];
  let filteredUniversities = []; // This will store the filtered universities
  let currentPage = 1;
  const universitiesPerPage = 10;
  
  document.getElementById('dropdownSearchBtn').addEventListener('click', async () => {
    const country = document.getElementById('countryDropdown').value;
    if (country === '') {
      alert('Please select a country from the dropdown.');
      return;
    }
    currentPage = 1; // Reset to the first page on new search
    await fetchUniversities(country);
  });
  
  // Show the second filter only after universities are fetched
  function showUniversityFilter() {
    const universityFilter = document.getElementById('universityFilter');
    universityFilter.style.display = 'block'; // Display the university filter input
  }
  
  // Function to filter universities within a country
  document.getElementById('universitySearch').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    
    // Perform a case-insensitive substring search
    filteredUniversities = universitiesData.filter(university => 
      university.name.toLowerCase().includes(searchQuery) // Check if any part of the name includes the search query
    );
    
    currentPage = 1; // Reset to the first page of the filtered results
    displayUniversities(filteredUniversities, currentPage);
  });
  
  async function fetchUniversities(country) {
    const resultsContainer = document.getElementById('results');
    const loader = document.getElementById('loader');
    
    resultsContainer.innerHTML = ''; 
    loader.style.display = 'block'; 
    
    try {
      const response = await fetch(`http://universities.hipolabs.com/search?country=${country}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      universitiesData = await response.json();
      filteredUniversities = universitiesData; // Initially, no filtering is applied
      if (universitiesData.length === 0) {
        resultsContainer.innerHTML = `<p>No universities found for ${country}.</p>`;
      } else {
        displayUniversities(universitiesData, currentPage);
        showUniversityFilter(); // Show the second filter after getting universities
      }
    } catch (error) {
      resultsContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    } finally {
      loader.style.display = 'none'; 
    }
  }
  
  // Display universities with pagination
  function displayUniversities(universities, page) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; 
  
    const start = (page - 1) * universitiesPerPage;
    const end = start + universitiesPerPage;
    const paginatedUniversities = universities.slice(start, end);
  
    paginatedUniversities.forEach(university => {
      const logoUrl = `https://logo.clearbit.com/${new URL(university.web_pages[0]).hostname}`;
      const defaultLogoUrl = 'University-of-the-Philippines-Logo.png'; 
  
      const universityElement = document.createElement('div');
      universityElement.classList.add('card');
      universityElement.innerHTML = `
        <img src="${logoUrl}" alt="${university.name} Logo" class="university-logo" onerror="this.onerror=null;this.src='${defaultLogoUrl}';">
        <h3>${university.name}</h3>
        <p>${university.country}</p>
        <a href="${university.web_pages[0]}" target="_blank">Visit Website</a>
      `;
      resultsContainer.appendChild(universityElement);
    });
  
    // Calculate total number of pages
    const totalPages = Math.ceil(universities.length / universitiesPerPage);
  
    // Always show pagination buttons
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination');
  
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = '<';
    prevButton.disabled = page === 1; // Disable if on the first page
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        displayUniversities(universities, currentPage);
      }
    });
    paginationContainer.appendChild(prevButton);
  
    // Add page numbers dynamically (if more than one page)
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        const pageNumberButton = document.createElement('button');
        pageNumberButton.textContent = i;
        if (i === page) {
          pageNumberButton.classList.add('active'); // Highlight the active page
        }
        pageNumberButton.addEventListener('click', () => {
          currentPage = i;
          displayUniversities(universities, currentPage);
        });
        paginationContainer.appendChild(pageNumberButton);
      }
    }
  
    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = '>';
    nextButton.disabled = page === totalPages; // Disable if on the last page
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayUniversities(universities, currentPage);
      }
    });
    paginationContainer.appendChild(nextButton);
  
    resultsContainer.appendChild(paginationContainer);
  }
  
  async function fetchCountries() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; 
    
    try {
      const countries = await fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => data.map(country => country.name.common))
        .catch(error => console.error('Error fetching countries:', error));
  
      const countryDropdown = document.getElementById('countryDropdown');
      countries.sort().forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryDropdown.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      loader.style.display = 'none'; 
    }
  }
  
  const  abcd = math.floor(math.rondom()* 6 + 1);