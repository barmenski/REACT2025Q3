## Performance Profiling

Initial profiling was performed using **React DevTools Profiler**.

- **Tested interactions:**
  - Sorting a column
  - Searching for a country
  - Selecting a year
  - Adding/removing columns
  

 ## Before optimization ✨

  - Commit Duration: 2.6s
  - Render Duration: 192.8ms
  - Interactions: Sorting a column

#### Flame Graph for sorting
![Profiler Flame Graph](src/assets/flame-sorting-before.png)

#### Ranked Chart for sorting
![Profiler Ranked Chart](src/assets/ranked-sorting-before.png)

---

  - Commit Duration: 4s
  - Render Duration: 93.8ms
  - Interactions: Searching for a country

#### Flame Graph for search
![Profiler Flame Graph](src/assets/flame-search-before.png)

#### Ranked Chart for search
![Profiler Ranked Chart](src/assets/ranked-search-before.PNG)

---

  - Commit Duration: 1.4s
  - Render Duration: 171.3.8ms
  - Interactions: Selecting a year

#### Flame Graph for year
![Profiler Flame Graph](src/assets/flame-year-before.png)

#### Ranked Chart for year
![Profiler Ranked Chart](src/assets/ranked-year-before.png)

---

  - Commit Duration: 1.3s
  - Render Duration: 166.1ms
  - Interactions: Adding/removing columns

#### Flame Graph for columns
![Profiler Flame Graph](src/assets/flame-columns-before.png)

#### Ranked Chart for columns
![Profiler Ranked Chart](src/assets/ranked-columns-before.png)

---

 ## After optimization 🧙‍♂️

  - Commit Duration: 8.2s
  - Render Duration: 61.8ms
  - Interactions: Sorting a column

#### Flame Graph for sorting
![Profiler Flame Graph](src/assets/flame-sorting-after.png)

#### Ranked Chart for sorting
![Profiler Ranked Chart](src/assets/ranked-sorting-after.png)

---

  - Commit Duration: 3.8s
  - Render Duration: 51.1ms
  - Interactions: Searching for a country

#### Flame Graph for search
![Profiler Flame Graph](src/assets/flame-search-after.png)

#### Ranked Chart for search
![Profiler Ranked Chart](src/assets/ranked-search-after.PNG)

---

  - Commit Duration: 2s
  - Render Duration: 183.8ms
  - Interactions: Selecting a year

#### Flame Graph for year
![Profiler Flame Graph](src/assets/flame-year-after.png)

#### Ranked Chart for year
![Profiler Ranked Chart](src/assets/ranked-year-after.png)

---

  - Commit Duration: 1.9s
  - Render Duration: 73.6ms
  - Interactions: Adding/removing columns

#### Flame Graph for columns
![Profiler Flame Graph](src/assets/flame-columns-after.png)

#### Ranked Chart for columns
![Profiler Ranked Chart](src/assets/ranked-columns-after.png)
