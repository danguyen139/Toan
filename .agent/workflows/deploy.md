---
description: Deploy Code to GitHub
---

This workflow defines the process for deploying code updates to the remote GitHub repository.

// turbo
1. Confirm with the user that the local testing is complete and they are ready to deploy.
2. Run `git add .` to stage all local changes.
3. Run `git commit -m "[Detailed description of changes]"` to commit the changes locally.
4. Run `git push origin main` to deploy the updates to the GitHub repository.
5. Notify the user once the deployment is successful.
