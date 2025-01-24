import { ChangeEvent, FormEvent } from 'react';

export type InputChangeEvent = ChangeEvent<HTMLInputElement>;
export type TextAreaChangeEvent = ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeEvent = ChangeEvent<HTMLSelectElement>;
export type FormSubmitEvent = FormEvent<HTMLFormElement>; 