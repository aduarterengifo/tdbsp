import { mergeConfig, type UserConfigExport } from "vitest/config"
import shared from "../../vitest.shared.js"

const config: UserConfigExport = {
  test: {
    coverage: {
      exclude: [
        "dist-package/",
        "src/__generated__/",
        "src/localDev.tsx",
        "src/_tests/"
      ],
      reporter: ["text", "cobertura", "html"]
    }
  }
}

export default mergeConfig(shared, config)
