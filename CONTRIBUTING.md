# Contribution Guide

Welcome to our open source community! This guide will help you quickly understand how to get involved in contributions.

## Quick Navigation
- [📋 Before You Start](#before-you-start)
- [🐛 Report Issues](#report-issues)
- [✨ Contribution Process](#contribution-process)
- [🤝 Community Guidelines](#community-guidelines)
- [📜 License Agreement](#license-agreement)
---
## Before You Start

### Read Project Documentation:
- [User Guide](./README.md)
- [Security Policy](./SECURITY.md)
- [Release Notes](./PUBLISH.md)

### Development Environment Setup  
**Prerequisites**
| Dependency | Version     |
|------------|-------------|
| Node       | >=16.x      |
| pnpm       | >=7.x       |
| React      | >=17.x      |
| Umi        | >=3.x       |
| Father     | >=4.x       |
| Webpack    | >=5.x       |

### Quick Start  
```bash
git clone https://github.com/GraphScope/portal.git
cd portal
```
### Install dependencies
```bash
    pnpm install

    pnpm run build # Build all sub packages only once

    docker pull registry.cn-hongkong.aliyuncs.com/graphscope/interactive:latest 
```

### Start the development environment
```bash
    docker run -d --name gs -p 8080:8080 -p 7777:7777 -p 10000:10000 -p 7687:7687 registry.cn-hongkong.aliyuncs.com/graphscope/interactive --enable-coordinator --port-mapping "8080:8080,7777:7777,10000:10000,7687:7687" # 之后只需 docker start gs

    pnpm run start

    cd examples && pnpm run start

    cd packages/studio-website 

    echo "COORDINATOR_URL= http://127.0.0.1:8080" >> .env # Configuring environment variables only needs to be done once
    
    pnpm run start
```
## Reporting Issues
### Issue Description
<!-- Clearly describe the observed abnormal phenomenon -->
✅ Good Example:  
"When continuously adding over 10 vertex types on the data modeling page, the right property panel shows layout misalignment"

### Reproduction Steps
1. Access page: `/modeling`
2. Preparation steps:
```bash
# Commands to run beforehand (if any)
docker exec -it gs ./bin/gs_interactive localhost:8080
```
3. Specific actions triggering the issue:
- Click "Add Node" button 10 times
- Scroll to the bottom of the panel

### expect vs actual
| Expected behavior | Actual behavior |
|---------|----------|
| The attribute panel should maintain a fixed width | the panel width can expand infinitely with the content |

### environmental information
- Version information of related dependency packages  
- Error log
- Browser information

## Attachment Requirements
- [ ] Browser console error screenshot (F12 > Console)
- [ ] Network request anomaly screenshot (F12 > Network)
- [ ] Docker log snippet (`docker logs gs --tail 100`)

## Contribution Process

1. **Fork the Repository**  
   Click the "Fork" button at the top-right corner of the GitHub page
2. **Clone to Local**
```bash
git clone https://github.com/your-username/repo.git
cd repo
git remote add upstream https://github.com/original-org/repo.git
```
3. **Branch Management**
```bash
   # 从最新main分支创建
   git checkout -b feat/interactive-query-builder
```
4. **Submit & Push**
```bash 
   git commit -s -m "feat: add new feature"
   git push origin feat/new-feature
```
5. Create PR  
Click on "Compare & pull request" on the GitHub repository page
## Community Guidelines

### Communication Channels
- Technical discussions: GitHub Discussions

### Code of Conduct
1. Adhere to the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)
2. Prohibit submission of malicious code
3. Respect all contributors

## License Agreement

All contributions are licensed under the [Apache 2.0 License](./LICENSE). By submitting your contribution, you agree to license your code under these terms.