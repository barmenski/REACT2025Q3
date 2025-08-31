## Performance Profiling

Initial profiling was performed using **React DevTools Profiler**.

- **Tested interactions:**
  - Sorting a column
  - Searching for a country
  - Selecting a year
  - Adding/removing columns
  

 ## Before optimization


 ## After optimization

  - Commit Duration: 8.2s
  - Render Duration: 61.8ms
  - Interactions: Sorting a column

### - Screenshots:

#### Flame Graph for sorting
![Profiler Flame Graph](src/assets//flame-sorting-after.png)

#### Ranked Chart for sorting
![Profiler Ranked Chart](src/assets/ranked-sorting-after.png)

  - Commit Duration: 3.8s
  - Render Duration: 51.1ms
  - Interactions: Searching for a country

### - Screenshots:

#### Flame Graph for search
![Profiler Flame Graph](src/assets/flame-search-after.png)

#### Ranked Chart for search
![Profiler Ranked Chart](src/assets/ranked-search-after.PNG)

  - Commit Duration: 2s
  - Render Duration: 183.8ms
  - Interactions: Selecting a year

### - Screenshots:

#### Flame Graph for year
![Profiler Flame Graph](src/assets/flame-year-after.png)

#### Ranked Chart for year
![Profiler Ranked Chart](src/assets/ranked-year-after.png)

  - Commit Duration: 1.9s
  - Render Duration: 73.6ms
  - Interactions: Adding/removing columns

### - Screenshots:

#### Flame Graph for columns
![Profiler Flame Graph](src/assets/flame-columns-after.png)

#### Ranked Chart for columns
![Profiler Ranked Chart](src/assets/ranked-columns-after.png)
