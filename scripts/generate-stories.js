const fs = require('fs');
const path = require('path');

function extractVariants(content) {
  try {
    // cva 함수 호출 부분을 찾기
    const cvaMatch = content.match(/cva\(([\s\S]*?)\)/);
    if (!cvaMatch) return null;

    // variants 객체를 찾기
    const variantsMatch = content.match(/variants:\s*{([\s\S]*?)},\s*defaultVariants/);
    if (!variantsMatch) return null;

    // defaultVariants 객체를 찾기
    const defaultVariantsMatch = content.match(/defaultVariants:\s*{([\s\S]*?)}\s*}/);
    if (!defaultVariantsMatch) return null;

    // variants 객체를 파싱
    const variantsStr = variantsMatch[1];
    const variants = {};
    const variantMatches = variantsStr.matchAll(/(\w+):\s*{([\s\S]*?)}/g);

    for (const match of variantMatches) {
      const [, variantName, variantContent] = match;
      const values = variantContent.match(/\w+(?=:)/g) || [];
      variants[variantName] = values;
    }

    // defaultVariants 객체를 파싱
    const defaultVariantsStr = defaultVariantsMatch[1];
    const defaultVariants = {};
    const defaultMatches = defaultVariantsStr.matchAll(/(\w+):\s*"(\w+)"/g);

    for (const match of defaultMatches) {
      const [, name, value] = match;
      defaultVariants[name] = value;
    }

    return { variants, defaultVariants };
  } catch (error) {
    console.error('Error extracting variants:', error);
    return null;
  }
}

function generateStoryTemplate(componentName, relativePath, content) {
  const variantInfo = extractVariants(content);
  if (!variantInfo) {
    return generateDefaultStoryTemplate(componentName, relativePath);
  }

  const { variants, defaultVariants } = variantInfo;

  // 각 variant에 대한 story 생성
  const variantStories = Object.entries(variants)
    .map(([variantName, values]) => {
      return values
        .map((value) => {
          const storyName = `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
          const args = {
            ...defaultVariants,
            [variantName]: value,
            children: `${storyName} ${componentName}`
          };

          return `
export const ${storyName}: Story = {
  args: ${JSON.stringify(args, null, 2)}
};`;
        })
        .join('\n');
    })
    .join('\n');

  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from '${relativePath}';

const meta = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
${Object.entries(variants)
  .map(
    ([name, values]) => `    ${name}: {
      options: ${JSON.stringify(values)},
      control: { type: 'select' }
    }`
  )
  .join(',\n')}
  },
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...${JSON.stringify(defaultVariants, null, 2)},
    children: 'Default ${componentName}'
  },
};
${variantStories}`;
}

function generateDefaultStoryTemplate(componentName, relativePath) {
  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from '${relativePath}';

const meta = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default ${componentName}'
  },
};`;
}

// findComponents 함수 수정
function findComponents(baseDir, currentDir) {
  try {
    if (!fs.existsSync(currentDir)) {
      console.log(`Directory does not exist: ${currentDir}`);
      return;
    }

    const files = fs.readdirSync(currentDir);

    files.forEach((file) => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        findComponents(baseDir, filePath);
      } else if (file.endsWith('.tsx') && !file.endsWith('.stories.tsx')) {
        const content = fs.readFileSync(filePath, 'utf-8');

        const componentName = path.basename(file, '.tsx');
        const componentDir = path.dirname(filePath);
        const storyPath = path.join(componentDir, `${componentName}.stories.tsx`);

        if (!fs.existsSync(storyPath)) {
          try {
            const relativePath = './' + path.basename(file, '.tsx');

            const titlePath = path.relative(baseDir, componentDir).split(path.sep).join('/');

            const storyTitle = titlePath ? `Components/${titlePath}/${componentName}` : `Components/${componentName}`;

            // content를 전달하여 variant 정보를 추출
            const storyContent = generateStoryTemplate(componentName, relativePath, content).replace(
              'Components/',
              storyTitle + '/'
            );

            fs.writeFileSync(storyPath, storyContent);
            console.log(`✓ Generated story for ${componentName} at ${storyPath}`);
          } catch (err) {
            console.error(`Error generating story for ${componentName}:`, err);
          }
        }
      }
    });
  } catch (err) {
    console.error('Error scanning directory:', err);
  }
}

const componentsDir = path.join(process.cwd(), 'src', 'components');
console.log('Scanning directory:', componentsDir);
findComponents(componentsDir, componentsDir);
