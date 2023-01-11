<a name="readme-top"></a>

<h2 align="center">
    Histree
</h2>

<p align="center">
    A web application for visualising complex genealogy.
</p>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>
<br />

## About The Project

Histree is a family tree visualisation tool developed to better visualise family trees of royals and other historial figures.

The application has been developed as part of the 3rd Year Software Engineering Group Project under the supervision of Dr. Anthony Field.

### Built With

* React.js
* Material UI
* Neo4j
* Flask

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/Histree/Histree.git
   ```

2. Install NPM packages within the frontend repository
   ```sh
   cd histree-frontend
   npm i
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage
### Frontend
The frontend application can be started up and viewed locally in the browser from the frontend root directory using:
```sh
npm run start
```

### Backend
From the backend root directory, run the server using
```sh
sh deploy.sh
```

Tests can be executed using
```sh
cd data_retrieval
python3 -m unittest discover tests/
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
