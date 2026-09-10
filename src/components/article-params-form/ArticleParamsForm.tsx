import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import {
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';
import type { ArticleStateType } from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	articleState: ArticleStateType;
	onChange: (articleState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	articleState,
	onChange,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formState, setFormState] = useState(articleState);
	const asideRef = useRef<HTMLElement>(null);
	const arrowButtonRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleOutsideClick = (event: MouseEvent) => {
			if (!(event.target instanceof Node)) {
				return;
			}

			const isOutsideAside = !asideRef.current?.contains(event.target);
			const isOutsideArrow = !arrowButtonRef.current?.contains(event.target);

			if (isOutsideAside && isOutsideArrow) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);

		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, [isOpen]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onChange(formState);
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
		onChange(defaultArticleState);
	};

	return (
		<>
			<div ref={arrowButtonRef}>
				<ArrowButton
					isOpen={isOpen}
					onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
				/>
			</div>
			<aside
				ref={asideRef}
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<div className={styles.formFields}>
						<Select
							title='Шрифт'
							selected={formState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={(fontFamilyOption) =>
								setFormState({ ...formState, fontFamilyOption })
							}
						/>
						<RadioGroup
							title='Размер шрифта'
							name='font-size'
							selected={formState.fontSizeOption}
							options={fontSizeOptions}
							onChange={(fontSizeOption) =>
								setFormState({ ...formState, fontSizeOption })
							}
						/>
						<Select
							title='Цвет шрифта'
							selected={formState.fontColor}
							options={fontColors}
							onChange={(fontColor) =>
								setFormState({ ...formState, fontColor })
							}
						/>
						<Separator />
						<Select
							title='Цвет фона'
							selected={formState.backgroundColor}
							options={backgroundColors}
							onChange={(backgroundColor) =>
								setFormState({ ...formState, backgroundColor })
							}
						/>
						<Select
							title='Ширина контента'
							selected={formState.contentWidth}
							options={contentWidthArr}
							onChange={(contentWidth) =>
								setFormState({ ...formState, contentWidth })
							}
						/>
					</div>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
